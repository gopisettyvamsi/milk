import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

let transporter: Transporter | null = null;

// Lazily initialize transporter (singleton)
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, 
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

// Load a Handlebars template from /lib/emailTemplates/*.hbs
const getTemplateContent = async (templateName: string): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'lib',
      'emailTemplates',
      `${templateName}.hbs`
    );
    return await fs.readFile(templatePath, 'utf8');
  } catch (error) {
    console.error(`❌ Failed to load template: ${templateName}`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

/**
 * Renders an email template with Handlebars
 */
export async function renderEmailTemplate(
  templateName: string,
  data: Record<string, any>
): Promise<string> {
  try {
    const templateSource = await getTemplateContent(templateName);
    const template = handlebars.compile(templateSource);

    // Format message text into HTML
    if (data.message && !data.messageHtml) {
      data.messageHtml = String(data.message).replace(/\n/g, '<br>');
    }

    // Inject defaults
    data.currentYear = data.currentYear || new Date().getFullYear();
    data.timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

          data.appUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.APP_URL || 'https://kagof.edvenswaevents.com/';

    return template(data);
  } catch (error) {
    console.error('❌ Error rendering email template:', error);
    throw error;
  }
}

/**
 * Sends an email via Nodemailer
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<any> {
  try {
    const transporter = getTransporter();

    // Fallback plain text if not provided
    const plainText =
      text || html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    const info = await transporter.sendMail({
      from: `"Edvenswa Team" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html,
      text: plainText,
      headers: {
        // 'Content-Type': 'text/html; charset=UTF-8',
        'X-Priority': '1',
      },
    }); 

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}
