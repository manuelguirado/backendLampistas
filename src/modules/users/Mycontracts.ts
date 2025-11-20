import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function myContracts(userID: number) {
  if (!userID) {
    throw new Error('userID is required');
  }

  const user = await prisma.user.findUnique({
    where: { userID: userID },
  });

  if (!user) {
    throw new Error('User does not exist');
  }
  const contracts = await prisma.contracts.findMany({
    where: { userID: userID },
  });

  if (!contracts) {
    return [];
  }

  try {
    const payload = { userID: user.userID, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, contracts: contracts };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
