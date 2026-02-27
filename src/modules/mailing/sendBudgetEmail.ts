import jwt, { SignOptions } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';
//TODO: Cambiar el email de destino por el del usuario a enviar el presupuesto
const templateBudget = readFileSync(
  join(__dirname, 'emailTemplates', 'templateBudget.html'),
  'utf-8',
);

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendBudgetEmail(
  title: string,
  content: string,
  items?: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'manu22.mgb@gmail.com',
      subject: title,
      html: templateBudget
        .replace('{{content}}', content)
        .replace('{{title}}', title)
        .replace('{{items}}', items || ''),
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
