import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function activateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const activatedCompany = await prisma.company.update({
    where: { companyID: companyID },
    data: {
      suspended: false,
      suspendedUntil: null,
    },
  });
  const findSubcitpion = await prisma.subscription.findFirst({
    where: {
      companyemail: activatedCompany.email,
      active: true,
    },
  });
  console.log('Found subscription:', findSubcitpion);
  if (!findSubcitpion) {
    throw new Error('No active subscription found for this company');
  }
  const activateSubscription = await stripe.subscriptions.update(
    findSubcitpion.subscriptionID,
    {
      pause_collection: '',
    },
  );
  try {
    const payload = {
      companyID: activatedCompany.companyID,
      role: activatedCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...activatedCompany, activateSubscription };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
