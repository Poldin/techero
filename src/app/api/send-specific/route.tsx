import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const SERVICES = {
  analisi: 'Analisi e Fattibilità',
  fornitori: 'Selezione Fornitori',
  execution: 'Esecuzione, sviluppo e delivery',
};

const EmailTemplate = ({
  name,
  description,
  service,
}: {
  name: string;
  description: string;
  service: keyof typeof SERVICES;
}) => {
  return (
    <div style={{
      backgroundColor: '#111',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{
        fontSize: '24px',
        marginBottom: '20px',
        fontWeight: 'normal',
      }}>
        Ciao {name},
      </h1>
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: 'rgba(255,255,255,0.9)',
        }}>
          riepilogo della tua richiesta.
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>
            Servizio richiesto:
          </p>
          <p style={{ color: 'white' }}>
            {SERVICES[service]}
          </p>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>
            Descrizione del progetto:
          </p>
          <p style={{ color: 'white' }}>{description}</p>
        </div>
      </div>
      
      <p style={{
        fontSize: '16px',
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '40px',
      }}>
        Ti scriviamo per approfondire dove possiamo arrivare insieme. Stay tuned.
      </p>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px',
        marginTop: '20px',
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '10px',
        }}>
          tecHero
        </div>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'rgba(255,255,255,0.6)',
          margin: 0,
        }}>
          Gestiamo il tuo progetto tecnologico dall&apos;idea alla realizzazione, 
          selezionando i migliori talenti e puntando all&apos;assoluta eccellenza.
        </p>
      </div>
    </div>
  );
};

export async function POST(req: Request) {
  try {
    const { name, email, description, service } = await req.json();

    const { data: emailData, error } = await resend.emails.send({
      from: 'TecHero <parliamone@budgez.xyz>',
      to: email,
      bcc: 'paolo@neocode.dev',
      subject: `Richiesta ${SERVICES[service as keyof typeof SERVICES]} | TecHero`,
      react: EmailTemplate({
        name,
        description,
        service: service as keyof typeof SERVICES,
      }),
    });

    if (error) {
      console.error('Errore durante invio email:', error);
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data: emailData });
  } catch (error) {
    console.error('Errore generale:', error);
    return NextResponse.json({ error });
  }
}