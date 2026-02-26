import Stripe from 'stripe';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '../../../../../generated/prisma';
const prisma = new PrismaClient();
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});
export default async function createAccount(email: string) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'ES',
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.STRIPE_REFRESH_URL as string,
      return_url: process.env.STRIPE_RETURN_URL as string,
      type: 'account_onboarding',
    });

    const saveData = await prisma.company.update({
      where: { email: email },
      data: { stripeAccountID: account.id },
    });

    if (!saveData) {
      console.error('Failed to update company with Stripe account ID');
      throw new Error('Failed to update company with Stripe account ID');
    }
    const tokenPayload = { accountId: account.id };
    const signOptions: SignOptions = {
      expiresIn: '1d',
      algorithm: 'HS256',
    };
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      signOptions,
    );
    return {
      url: accountLink.url,

      token: token,
    };
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    throw error;
  }
}
