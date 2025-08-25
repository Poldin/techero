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
  description: 'Invia email con informazioni del lead quando hai raccolto abbastanza dati per una quotazione preliminare. Restituisce una stringa JSON: { ok: boolean, id?: string | null, error?: string }',
  inputSchema: z.object({
    customerName: z.string().optional().describe('Nome del cliente/contatto'),
    customerEmail: z.string().email().optional().describe('Email del cliente'),
    customerPhone: z.string().optional().describe('Numero di telefono del cliente (opzionale)'),
    company: z.string().optional().describe('Nome azienda/organizzazione (opzionale)'),
    projectSummary: z.string().optional().describe('Riassunto delle informazioni raccolte sul progetto'),
    chatId: z.string().optional().describe('ID pubblico della conversazione')
  }),
  execute: async ({ customerName, customerEmail, customerPhone, company, projectSummary, chatId }: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    company?: string;
    projectSummary?: string;
    chatId?: string;
  }) => {
    try {
      console.log('sendLeadEmail: start', {
        hasEmail: Boolean(customerEmail),
        hasPhone: Boolean(customerPhone),
        hasCompany: Boolean(company),
        chatId
      });
      const emailHtml = `
        <h2>🚀 Nuovo Lead da tecHero Chat</h2>
        
        <h3>📋 Informazioni Cliente</h3>
        <p><strong>Nome:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        ${customerPhone ? `<p><strong>Telefono:</strong> ${customerPhone}</p>` : ''}
        ${company ? `<p><strong>Azienda:</strong> ${company}</p>` : ''}
        
        <h3>💼 Riassunto Progetto</h3>
        <p>${projectSummary?.replace(/\n/g, '<br>')}</p>
        
        <h3>🔗 Link Chat</h3>
        <p><a href="https://techero.xyz/chat/${chatId}" target="_blank">Visualizza conversazione completa</a></p>
        
        <hr>
        <p><small>Email generata automaticamente dal chatbot di tecHero</small></p>
      `;
      console.log('sendLeadEmail: emailHtml length', emailHtml.length);

      console.log('sendLeadEmail: calling Resend');
      const sendResult = await resend.emails.send({
        from: 'tecHero Bot <onboarding@techero.xyz>',
        to: ['paolo@neocode.dev'],
        subject: `🎯 Nuovo Lead: ${customerName}${company ? ` (${company})` : ''}`,
        html: emailHtml,
      });
      console.log('sendLeadEmail: Resend response', {
        ok: !sendResult?.error && !!sendResult?.data?.id,
        id: sendResult?.data?.id ?? null,
        error: sendResult?.error ?? null
      });
      
      return JSON.stringify({ ok: true, id: sendResult?.data?.id ?? null });
    } catch (error) {
      console.error('Error sending lead email:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log('sendLeadEmail: returning failure', { error: message });
      // Lancia errore per far marcare il risultato come is_error al provider
      throw new Error(JSON.stringify({ ok: false, error: message }));
    }
  }
};

export async function POST(req: Request) {
  try {
    console.log('Chat API: POST start');
    const { messages, conversationId }: { messages: UIMessage[], conversationId?: string } = await req.json();
    console.log('Chat API: payload received', {
      messagesCount: messages?.length ?? 0,
      hasConversationId: Boolean(conversationId)
    });
    
    let currentConversationId = conversationId;
    let publicId = '';

    // Se non c'è conversationId, crea una nuova conversazione
    if (!currentConversationId) {
      console.log('Chat API: creating new conversation');
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
      console.log('Chat API: conversation created', { publicId, currentConversationId });
    } else {
      // Recupera il public_id della conversazione esistente
      console.log('Chat API: loading existing conversation publicId');
      const { data: conversation } = await supabase
        .from('conversations')
        .select('public_id')
        .eq('id', currentConversationId)
        .single();
      
      publicId = conversation?.public_id || '';
      console.log('Chat API: existing conversation loaded', { publicId, currentConversationId });
    }

    // Salva il messaggio dell'utente se presente
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      console.log('Chat API: saving user message');
      await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: currentConversationId,
          role: 'user',
          content: lastMessage.parts.map(part => part.type === 'text' ? part.text : '').join(''),
          metadata: { timestamp: new Date().toISOString() }
        });
      console.log('Chat API: user message saved');
    }

    console.log('Chat API: starting streamText');
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
\nGESTIONE TOOL E CONFERMA ESITO:\n- Quando usi il tool sendLeadEmail, il risultato che ricevi è una stringa JSON (successo) oppure un errore marcato dal provider (is_error).\n- Dopo l'esecuzione del tool, comportati così:\n  - Se successo: parsa la stringa JSON { ok, id? } e conferma esplicitamente all'utente che la richiesta è stata inviata correttamente, indica che riceverà a breve una quotazione dettagliata, e saluta in modo professionale.\n  - Se is_error: comunica che c'è stato un problema tecnico nell'invio, chiedi un canale di contatto alternativo (es. un'altra email/telefono) oppure informa che riproverai a breve, poi saluta educatamente.\n- Non mostrare all'utente dettagli tecnici (id, error), usa un linguaggio semplice.

QUANDO HAI RACCOLTO ABBASTANZA INFORMAZIONI (progetto, budget indicativo, tempistiche, contatti):
- USA il tool "sendLeadEmail" per inviare automaticamente i dati a paolo@neocode.dev includendo il link di conversazione (essenziale!)
- Dopo l'esito del tool, conferma l'invio riuscito o segnala l'errore come descritto sopra, quindi saluta l'utente ringraziando per il tempo speso e chiedendo di contattarti per qualsiasi domanda (eventualmente, se errore possono scriverci a scrivici@techero.xyz)

TEST
è possibile che faremo dei test con questo tool, fai quello che ti viene detto in quel caso: è un test se iniziamo il messaggio con <test>. solo in quel caso ovviamente.`,
      messages: convertToModelMessages(messages),
      temperature: 0.5,
      maxOutputTokens: 512,
      toolChoice: 'auto',
      tools: {
        sendLeadEmail: sendLeadEmailTool,
      },
      onFinish: async (result) => {
        // Salva la risposta dell'AI
        if (result.text) {
          console.log('Chat API: onFinish saving assistant message');
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
          console.log('Chat API: assistant message saved');
        }
      },
    });

    // Aggiungi il conversationId alla risposta
    const response = result.toUIMessageStreamResponse();
    console.log('Chat API: setting response headers', { currentConversationId, publicId });
    response.headers.set('X-Conversation-Id', currentConversationId || '');
    response.headers.set('X-Public-Id', publicId);
    
    console.log('Chat API: returning response');
    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Errore interno del server', { status: 500 });
  }
}