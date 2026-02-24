import Stripe from 'stripe';
import dotenv from 'dotenv';
import { sendSubcribeEmail } from '../../mailing/sendSubcribeEmail';
dotenv.config();

// Crea un PaymentIntent y devuelve el client_secret
export async function createSubcription(
  companyemail: string,
  companyPhone: string,
  price: number,
) {
  console.log('createSubscription called with:', {
    companyemail,
    companyPhone,
    price,
  });
  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-12-15.clover',
  });
  console.log('Creating payment intent for:', {
    companyemail,
    companyPhone,
    price,
  });
  const listCustomers = await stripeClient.customers.list({
    email: companyemail,
  });
  console.log('List customers response:', listCustomers);
  if (listCustomers.data.length > 0) {
    throw new Error('Customer with this email already exists');
  }

  const customer = await stripeClient.customers.create({
    email: companyemail,
    phone: companyPhone,
  });
  console.log('Customer created:', customer);
  const subscription = await stripeClient.subscriptions
    .create({
      customer: customer.id,
      items: [
        {
          price: 'price_1SrcTzP2baommXa6uqNoJVur',
          quantity: 1,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.confirmation_secret'],
    })
    .catch((error) => {
      console.error('Error creating subscription:', error);
      throw error;
    });
  const sendEmail = await sendSubcribeEmail(
    '¡Bienvenido a Lampistas!',
    'Gracias por suscribirte a nuestro servicio. Estamos emocionados de tenerte con nosotros. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.',
  );

  if (
    typeof subscription.latest_invoice !== 'string' &&
    subscription.latest_invoice?.confirmation_secret
  ) {
    console.log(
      'Confirmation secret found:',
      subscription.latest_invoice.confirmation_secret,
    );
    const clientSecret =
      subscription.latest_invoice.confirmation_secret.client_secret;
    console.log('Client secret:', clientSecret);
    return {
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status,
      sendEmail,
    };
  } else {
    throw new Error('Confirmation secret is missing');
  }
}
