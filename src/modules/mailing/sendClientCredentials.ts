import jwt, { SignOptions } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';

const templateClientData = readFileSync(
  join(__dirname, 'emailTemplates', 'templateRegisterClient.html'),
  'utf-8',
);

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendClientCredentialsEmail(
  title: string,
  content: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'manu22.mgb@gmail.com',
      subject: title,
      html: templateClientData
        .replace('{{content}}', content)
        .replace('{{title}}', title),
    });
    if (error) {
      console.error('Error sending client credentials email:', error);
    }
    const token = process.env.JWT_SECRET as string;
    const payload = { title, content };
    const options: SignOptions = { expiresIn: '1h' };
    const newsletterToken = jwt.sign(payload, token, options);

    return {
      message: 'Client credentials email sent successfully',
      newsletterToken,
      data,
    };
  } catch (error) {
    console.error('Error sending client credentials email:', error);
  }
}
