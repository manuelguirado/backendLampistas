import Stripe from 'stripe';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '../../../../../generated/prisma';
const prisma = new PrismaClient();
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});

export default async function createLoginLink(email: string) {
  try {
    const accountID = await prisma.company
      .findUnique({
        where: { email },
        select: { stripeAccountID: true },
      })
      .then((company) => company?.stripeAccountID);

    if (!accountID) {
      throw new Error('No Stripe account found for this email');
    }
    const loginLink = await stripe.accounts.createLoginLink(accountID);
    const tokenPayload = {
      companyID: accountID,
    };
    const signOptions: SignOptions = {
      expiresIn: '2h',
      algorithm: 'HS256',
    };
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      signOptions,
    );
    return {
      loginLink: loginLink.url,
      token: token,
    };
  } catch (error) {
    console.error('Error creating Stripe login link:', error);
    throw error;
  }
}
