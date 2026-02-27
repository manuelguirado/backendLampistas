import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
export async function createCheckoutsession() {
  const stripeClient = new stripe.Stripe(
    process.env.STRIPE_SECRET_KEY as string,
    {
      apiVersion: '2025-12-15.clover',
    },
  );
  const session = await stripeClient.checkout.sessions.create({
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    line_items: [
      {
        price: 'price_1SrcTzP2baommXa6uqNoJVur',
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  return {
    sessionId: session.id,
    url: session.url,
    secret: session.client_secret,
  };
}
