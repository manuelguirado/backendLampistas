import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function eliminateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!company) {
    throw new Error('Company not found');
  }
  await prisma.adminsCompanies.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar la compañía
  await prisma.company.delete({
    where: { companyID: companyID },
  });
  await prisma.directions.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar trabajadores asociados a la compañía
  await prisma.worker.deleteMany({
    where: { companyID: companyID },
  });
  const subscriptions = await prisma.subscription.findFirst({
    where: { companyemail: company.email, active: true },
  });
  const eliminateSubctiion = await stripe.subscriptions.cancel(
    subscriptions?.subscriptionID as string,
  );
  try {
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      message: 'Company and associated data deleted successfully',
      token,
      eliminateSubctiion,
    };
  } catch (error) {
    throw new Error(`Error generating token: ${error}`);
  }
}
