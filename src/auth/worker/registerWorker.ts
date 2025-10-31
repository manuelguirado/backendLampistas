import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
export async function registerWorker(
  email: string,
  password: string,
  name: string,
  companyId: number,
) {
  if (!email || !name || !password) {
    throw new Error('Email, name and password are required');
  }
  const existingWorker = await prisma.worker.findFirst({
    where: { email, companyID: companyId },
  });
  if (existingWorker) {
    throw new Error('Worker already exists');
  }
  const findCompanyDID = await prisma.company.findUnique({
    where: { companyID: companyId },
  });
  if (!findCompanyDID) {
    throw new Error('Company not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdWorker = await prisma.worker.create({
    data: {
      email,
      name,
      password: hashedPassword,
      companyID: companyId,
    },
  });
  return createdWorker;
}
