import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

export async function subscribeToNewsletter(email: string) {
  const existingSubscription = await prisma.newsLetter.findUnique({
    where: { email },
  });
  if (existingSubscription) {
    throw new Error('Email is already subscribed to the newsletter.');
  }
  const subscription = await prisma.newsLetter.create({
    data: { email },
  });
  const token = process.env.JWT_SECRET;
  const options: SignOptions = { expiresIn: '7d' };
  const payload = { email };
  const jwtToken = jwt.sign(payload, token!, options);

  return { subscription, jwtToken };
}
