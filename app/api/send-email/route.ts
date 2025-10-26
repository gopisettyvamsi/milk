import { NextResponse } from 'next/server';
import { renderEmailTemplate, sendEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, company, helpOption, message } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const adminEmail = process.env.EMAIL_USERNAME;
    
    if (!adminEmail) {
      console.error('Admin email not configured in environment variables');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }
    
    // Timestamp for both emails
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    // Prepare data for templates
    const templateData = {
      firstName,
      lastName,
      email,
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      helpOption: helpOption || 'Not specified',
      message: message || 'No message provided',
      timestamp
    };
    
    // 1. Send notification email to admin
    const adminHtmlTemplate = await renderEmailTemplate('admin', templateData);
    
    // Generate plain text version for better email compatibility
    const adminTextVersion = `
      New Contact Form Submission
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Company: ${company || 'Not provided'}
      Help Option: ${helpOption || 'Not specified'}
      
      Message:
      ${message || 'No message provided'}
      
      Received: ${timestamp}
    `;
    
    await sendEmail({
      to: adminEmail,
      subject: `🔔 New Contact Form Submission from ${firstName} ${lastName}`,
      html: adminHtmlTemplate,
      text: adminTextVersion
    });
    
    // 2. Send thank you email to the user
    const userHtmlTemplate = await renderEmailTemplate('user', templateData);
    
    // Generate plain text version for user email
    const userTextVersion = `
      Thank You for Contacting Edvenswa!
      
      Dear ${firstName},
      
      Thank you for reaching out to Edvenswa. We have received your inquiry regarding ${helpOption || 'your request'}.
      
      Our team is reviewing your message and one of our representatives will contact you within 24-48 business hours to discuss how we can assist with your needs.
      
      If you have any urgent questions in the meantime, please feel free to call us at 877-253-3484.
      
      Your Inquiry Details:
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Company: ${company || 'Not provided'}
      Help Option: ${helpOption || 'Not specified'}
      Message: "${message || 'No message provided'}"
      
      Best Regards,
      Edvenswa Customer Success Team
      
      © ${new Date().getFullYear()} Edvenswa Enterprises. All rights reserved.
      11205 Alpharetta Hwy Suite H2 Roswell, GA 30076
    `;
    
    await sendEmail({
      to: email,
      subject: `Thank You for Contacting Edvenswa, ${firstName}!`,
      html: userHtmlTemplate,
      text: userTextVersion
    });
    
    return NextResponse.json({ 
      message: 'Emails sent successfully',
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}