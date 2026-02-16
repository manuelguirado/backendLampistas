import Stripe from 'stripe';
import { PrismaClient } from '../../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { sendPaymentConfirmationEmail } from '../../../mailing/sendPaymentConfirmation';
import { savePayment } from '../../../../utils/savePayment';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});
const prisma = new PrismaClient();

export async function createPayment(
  ammount: number,
  userID: number,
  companyID: number,
) {
  const [company, user] = await Promise.all([
    prisma.company.findUnique({
      where: {
        companyID: companyID,
      },
      select: {
        companyID: true,
        stripeAccountID: true,
      },
    }),
    prisma.user.findUnique({
      where: {
        userID: userID,
      },
      select: {
        userID: true,
        email: true,
      },
    }),
  ]);
  if (!company) {
    throw new Error('Company not found');
  }
  if (!user) {
    throw new Error('User not found');
  }
  const comision = ammount * 0.1;
  const total = ammount - comision;
  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: 'EUR',
    payment_method_types: ['card'],
    application_fee_amount: comision * 100,
    transfer_data: {
      destination: company.stripeAccountID!,
    },
    metadata: {
      companyID: company.companyID.toString(),
    },
  });
  const savedPayment = await savePayment(
    payment.id,
    company.companyID,
    user.userID,
    total,
    'pending',
    new Date(),
    user.email,
  );
  const sendEmail = await sendPaymentConfirmationEmail(
    '¡Pago Recibido!',
    `Hemos recibido tu pago de ${total} EUR. Gracias por tu confianza en nuestros servicios.`,
  );
  const secret = process.env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: '1h',
  };
  const token = jwt.sign(
    {
      paymentID: payment.id,
      companyID: company.companyID,
      userID: user.userID,
    },
    secret!,
    options,
  );
  return {
    clientSecret: payment.client_secret,
    payment,
    token,
    savedPayment,
    sendEmail,
  };
}
