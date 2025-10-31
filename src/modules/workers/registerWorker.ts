import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';

const prisma = new PrismaClient();
export async function registerWorker(
  email: string,
  password: string,
  name: string,
  companyID: number,
) {
  if (!email || !password || !name || !companyID) {
    throw new Error('Email, password, name and companyID are required');
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
      companyID,
    },
  });
  return worker;
}
