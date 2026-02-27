import jwt, { SignOptions } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';
import { getSubscribers } from './getSubcribers';
//TODO: cambiar el email de destino por el del usuario a enviar el newsletter
const templateSubcribe = readFileSync(
  join(__dirname, 'emailTemplates', 'templateSubcribe.html'),
  'utf-8',
);
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendSubcribeEmail(title: string, content: string) {
  const subscribers = await getSubscribers();
  const emails = subscribers.map((sub) => sub.email);
  if (emails.length === 0) {
    console.log('No subscribers to send the newsletter to.');
    return;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'manu22.mgb@gmail.com',
      subject: title,
      html: templateSubcribe
        .replace('{{content}}', content)
        .replace('{{title}}', title),
    });
    if (error) {
      console.error('Error sending newsletter:', error);
    }
    const token = process.env.JWT_SECRET as string;
    const payload = { title, content };
    const options: SignOptions = { expiresIn: '1h' };
    const newsletterToken = jwt.sign(payload, token, options);

    return {
      message: 'Newsletter sent successfully',
      newsletterToken,
      data,
    };
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
}
