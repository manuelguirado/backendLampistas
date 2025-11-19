import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

const prisma = new PrismaClient();
export async function registerWorker(
  email: string,
  password: string,
  name: string,
  companyID: number,
) {
  if (!email || !password || !name || !companyID) {
    throw new Error('Email, password, name, and companyID are required');
  }
  const existingWorker = await prisma.worker.findUnique({
    where: { email },
  });
  if (existingWorker) {
    throw new Error('Worker already exists');
  }
  const hashedPassword = await hashPassword(password);
  const worker = await prisma.worker.create({
    data: {
      email,
      password: hashedPassword,
      name,
      company: {
        connect: { companyID },
      },
    },
  });
  try {
    const payload = { workerID: worker.workerid, companyID: worker.companyID };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...worker };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
