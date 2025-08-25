import { anthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { supabase, generatePublicId } from '@/lib/supabase';
import { Resend } from 'resend';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Inizializza Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Tool per l'invio di email lead
const sendLeadEmailTool = {
  description: 'Invia email con informazioni del lead quando hai raccolto abbastanza dati per una quotazione preliminare',
  inputSchema: z.object({
    customerName: z.string().describe('Nome del cliente/contatto'),
    customerEmail: z.string().email().describe('Email del cliente'),
    customerPhone: z.string().optional().describe('Numero di telefono del cliente (opzionale)'),
    company: z.string().optional().describe('Nome azienda/organizzazione (opzionale)'),
    projectSummary: z.string().describe('Riassunto delle informazioni raccolte sul progetto'),
    chatId: z.string().describe('ID pubblico della conversazione')
  }),
  execute: async ({ customerName, customerEmail, customerPhone, company, projectSummary, chatId }: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    company?: string;
    projectSummary: string;
    chatId: string;
  }) => {
    try {
      const emailHtml = `
        <h2>🚀 Nuovo Lead da tecHero Chat</h2>
        
        <h3>📋 Informazioni Cliente</h3>
        <p><strong>Nome:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        ${customerPhone ? `<p><strong>Telefono:</strong> ${customerPhone}</p>` : ''}
        ${company ? `<p><strong>Azienda:</strong> ${company}</p>` : ''}
        
        <h3>💼 Riassunto Progetto</h3>
        <p>${projectSummary.replace(/\n/g, '<br>')}</p>
        
        <h3>🔗 Link Chat</h3>
        <p><a href="https://techero.xyz/chat/${chatId}" target="_blank">Visualizza conversazione completa</a></p>
        
        <hr>
        <p><small>Email generata automaticamente dal chatbot di tecHero</small></p>
      `;

      await resend.emails.send({
        from: 'tecHero Bot <noreply@techero.xyz>',
        to: ['paolo@neocode.dev'],
        subject: `🎯 Nuovo Lead: ${customerName}${company ? ` (${company})` : ''}`,
        html: emailHtml,
      });

      return 'Email inviata con successo!';
    } catch (error) {
      console.error('Error sending lead email:', error);
      return 'Errore nell\'invio dell\'email';
    }
  }
};

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
Questa conversazione è disponibile su: https://techero.xyz/chat/${publicId}

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

4. DATI DI CONTATTO:
   - Chiedi sempre nome completo, email e numero di telefono per poter inviare la quotazione

PREZZI RIFERIMENTO (non condividere):
- MVP semplice: €2K-6K
- Piattaforma completa: €6K-18K  
- Sistema enterprise: €15K+

REGOLE:
- Risposte BREVI e DIRETTE
- UNA sola domanda per messaggio
- Professionale ma sintetico nella lingua dell'utente
- Parla solo di temi inerenti alle attività di techero: sviluppo software web con nextjs e supabase
- Non devi assolutamente parlare di prezzi o dare stime, devi solo raccogliere le informazioni essenziali

QUANDO HAI RACCOLTO ABBASTANZA INFORMAZIONI (progetto, budget indicativo, tempistiche, contatti):
- USA il tool "sendLeadEmail" per inviare automaticamente i dati a paolo@neocode.dev
- Ringrazia il cliente e digli che riceverà presto una quotazione dettagliata
- NON invitare più a prenotare call - l'email sarà sufficiente`,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
      tools: {
        sendLeadEmail: sendLeadEmailTool,
      },
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