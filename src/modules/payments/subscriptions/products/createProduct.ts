import { PrismaClient } from '../../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import saveProduct from '../../../../utils/saveProduct';
import { Stripe } from 'stripe';
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});

export default async function createProduct(
  title: string,
  description: string,
  items: { price: number; currency: string }[],
  companyEmail: string,
) {
  try {
    const accountId = await prisma.company.findUnique({
      where: { email: companyEmail },
      select: { stripeAccountID: true, companyID: true },
    });
    if (!accountId || !accountId.stripeAccountID) {
      throw new Error('Company not found or Stripe account ID missing');
    }
    const product = await stripe.products.create(
      {
        name: title,
        description: description,
      },
      {
        stripeAccount: accountId.stripeAccountID,
      },
    );
    for (const item of items) {
      await stripe.prices.create(
        {
          unit_amount: item.price,
          currency: item.currency,
          product: product.id,
        },
        {
          stripeAccount: accountId.stripeAccountID,
        },
      );
    }
    const price = await stripe.prices.create(
      {
        unit_amount: items[0].price,
        currency: items[0].currency,
        product: product.id,
      },
      {
        stripeAccount: accountId.stripeAccountID,
      },
    );
    const saveData = await saveProduct(
      title,
      description,
      items[0].price,
      items[0].currency,
      accountId.companyID,
      product.id,
      price.id,
      items.map((item) => ({
        name: title,
        price: item.price,
        currency: item.currency,
      })),
    );
    const tokenPayload = {
      companyID: accountId.companyID,
      email: companyEmail,
    };
    const tokenOptions: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET_KEY as string,
      tokenOptions,
    );

    return { saveData, token, product, price };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
