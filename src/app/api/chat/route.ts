import { anthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { supabase, generatePublicId } from '@/lib/supabase';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, conversationId }: { messages: UIMessage[], conversationId?: string } = await req.json();
    
    let currentConversationId = conversationId;
    let publicId = '';

    // Se non c'è conversationId, crea una nuova conversazione
    if (!currentConversationId) {
      publicId = generatePublicId();
      
      // Verifica che il public_id sia unico
      let isUnique = false;
      while (!isUnique) {
        const { data: existing } = await supabase
          .from('conversations')
          .select('public_id')
          .eq('public_id', publicId)
          .single();
        
        if (!existing) {
          isUnique = true;
        } else {
          publicId = generatePublicId();
        }
      }

      // Crea nuova conversazione
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          public_id: publicId,
          status: 'active',
          metadata: {
            user_agent: req.headers.get('user-agent'),
            created_from: 'chat_widget'
          }
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw new Error('Failed to create conversation');
      }

      currentConversationId = newConversation.id;
    } else {
      // Recupera il public_id della conversazione esistente
      const { data: conversation } = await supabase
        .from('conversations')
        .select('public_id')
        .eq('id', currentConversationId)
        .single();
      
      publicId = conversation?.public_id || '';
    }

    // Salva il messaggio dell'utente se presente
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: currentConversationId,
          role: 'user',
          content: lastMessage.parts.map(part => part.type === 'text' ? part.text : '').join(''),
          metadata: { timestamp: new Date().toISOString() }
        });
    }

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: `Sei il bot di tecHero per la qualificazione di progetti tech. Il tuo obiettivo è raccogliere informazioni essenziali per una quotazione preliminare attraverso domande mirate.

CODICE CONVERSAZIONE: ${publicId}
Questa conversazione è disponibile su: https://techero.it/chat/${publicId}

APPROCCIO:
- Fai UNA domanda alla volta
- Mantieni le domande semplici e dirette
- Non chiedere dettagli tecnici complessi in questa fase
- Raccogli solo le informazioni essenziali per stimare complessità e prezzo

INFORMAZIONI DA RACCOGLIERE (in quest'ordine):
0. CAPISCI L'INTENTO DEL PROGETTO
   - Qual è il tuo obiettivo?
   - Qual è il tuo budget?
   - Qual è il tuo tempo di rilascio?
   - Qual è il tuo target?
   - Qual è il tuo contesto?
   - Qual è il tuo contesto?

1. PROGETTO & COMPLESSITÀ TECNICA:
   - Che tipo di progetto è? (web app, e-commerce, gestionale, etc.)
   - Quanti tipi di utenti diversi userranno il sistema?
   - Chi è il target principale?
   - Quanti utenti stimati nei primi mesi?
   - Serve gestione pagamenti?
   - Serve integrazione con altri sistemi?

2. TEMPISTICHE & BUDGET:
   - Quando vorresti lanciare?
   - Hai un budget indicativo in mente?

3. CONTESTO CLIENTE:
   - Sei un privato, startup o azienda?
   - È solo un'idea o hai già qualcosa di avviato?
   - Hai esperienze precedenti con sviluppo software?

PREZZI RIFERIMENTO (non condividere subito):
- MVP semplice: €2K-6K
- Piattaforma completa: €6K-18K  
- Sistema enterprise: €15K+

REGOLE:
- Risposte BREVI e DIRETTE
- UNA sola domanda per messaggio
- Quando hai raccolto abbastanza informazioni, invita a prenotare una call usando: https://techero.it/call/${publicId}
- Professionale ma sintetico nella lingua dell'utente
- Parla solo di temi inerenti alle attività di techero: sviluppo software web con nextjs e supabase (quindi un sacco di cose, integrando stripe, api esterne, airtable e tutti i software possibili, ma non devi spiegare tutto questo, solo i concetti base): riporta la conversazione qui se esce

tu non devi assolutamente parlare di prezzi o dare stime, devi solo raccogliere le informazioni essenziali per una quotazione preliminare.
per questo è importante che approfondisci bene le informazioni anche se come detto non è necessario richiedere risposte esageratamente esaustive all'utente.`,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
      onFinish: async (result) => {
        // Salva la risposta dell'AI
        if (result.text) {
          await supabase
            .from('conversation_messages')
            .insert({
              conversation_id: currentConversationId,
              role: 'assistant',
              content: result.text,
              metadata: { 
                timestamp: new Date().toISOString(),
                finish_reason: result.finishReason,
                usage: result.usage
              }
            });
        }
      },
    });

    // Aggiungi il conversationId alla risposta
    const response = result.toUIMessageStreamResponse();
    response.headers.set('X-Conversation-Id', currentConversationId || '');
    response.headers.set('X-Public-Id', publicId);
    
    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Errore interno del server', { status: 500 });
  }
}