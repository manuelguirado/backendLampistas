import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Crea un PaymentIntent y devuelve el client_secret
export async function createSubcription(companyemail: string, price: number) {
  console.log('createSubscription called with:', { companyemail, price });
  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-12-15.clover',
  });
  console.log('Creating payment intent for:', { companyemail, price });
  const customer = await stripeClient.customers.create({
    email: companyemail,
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
      expand: ['latest_invoice.payment_intent'],
    })
    .catch((error) => {
      console.error('Error creating subscription:', error);
      throw error;
    });
  console.log('Subscription created:', subscription);
  console.log('Latest invoice:', subscription.latest_invoice);
  let clientSecret: string | null = null;
  if (
    subscription.latest_invoice &&
    typeof subscription.latest_invoice === 'object' &&
    'payment_intent' in subscription.latest_invoice &&
    subscription.latest_invoice.payment_intent &&
    typeof subscription.latest_invoice.payment_intent === 'object' &&
    'client_secret' in subscription.latest_invoice.payment_intent
  ) {
    clientSecret = (
      subscription.latest_invoice.payment_intent as Stripe.PaymentIntent
    ).client_secret;
  }
  return {
    subscriptionId: subscription.id,
    clientSecret,
    status: subscription.status,
  };
}
