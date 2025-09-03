import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { senderEmail, senderPhone, recipientEmail, message, businessName } = body;
    
    if (!senderEmail || !recipientEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: senderEmail, recipientEmail, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the request for debugging
    console.log('Contact form submission:', {
      senderEmail,
      senderPhone: senderPhone || 'Not provided',
      recipientEmail,
      businessName,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    // Prepare email content
    const emailHtml = `
      <h2>📧 Nuovo messaggio di contatto</h2>
      
      <h3>👤 Informazioni mittente</h3>
      <p><strong>Email:</strong> ${senderEmail}</p>
      ${senderPhone ? `<p><strong>Telefono:</strong> ${senderPhone}</p>` : ''}
      <p><strong>Azienda di destinazione:</strong> ${businessName}</p>
      
      <h3>💬 Messaggio</h3>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #22c55e;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <hr style="margin: 20px 0;">
      <p><small>Messaggio inviato tramite il form di contatto di ${businessName}</small></p>
      <p><small>Data: ${new Date().toLocaleString('it-IT')}</small></p>
    `;

    // Prepare recipients list - always include oloapiccoli@gmail.com
    const recipients = ['oloapiccoli@gmail.com'];
    
    // Add business recipient if different from oloapiccoli@gmail.com
    if (recipientEmail && recipientEmail !== 'oloapiccoli@gmail.com') {
      recipients.push(recipientEmail);
    }

    console.log('Sending email to recipients:', recipients);

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'tecHero Contatti <onboarding@techero.xyz>',
      to: recipients,
      replyTo: senderEmail,
      subject: `💌 Nuovo messaggio da ${businessName}`,
      html: emailHtml,
    });

    console.log('Resend email result:', {
      success: !emailResult.error && !!emailResult.data?.id,
      id: emailResult.data?.id,
      error: emailResult.error
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      throw new Error('Failed to send email');
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        data: {
          emailId: emailResult.data?.id,
          recipients: recipients,
          senderEmail,
          senderPhone: senderPhone || null,
          businessName,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}
