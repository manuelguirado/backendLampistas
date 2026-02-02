import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});
const prisma = new PrismaClient();
export async function suspendCompany(companyEmail: string, suspendAt?: Date) {
  console.log('Suspending company:', { companyEmail, suspendAt });
  if (!companyEmail) {
    throw new Error('Company Email is required');
  }
  const findSubcitpion = await prisma.subscription.findFirst({
    where: {
      companyemail: companyEmail,
      active: true,
    },
  });
  console.log('Found subscription:', findSubcitpion);
  if (!findSubcitpion) {
    throw new Error('No active subscription found for this company');
  }

  const suspendCompany = await prisma.company.update({
    where: { email: companyEmail },
    data: {
      suspended: true,
      suspendedUntil: suspendAt ?? null,
    },
  });
  try {
    const payload = {
      companyID: suspendCompany.companyID,
      role: suspendCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...suspendCompany };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
