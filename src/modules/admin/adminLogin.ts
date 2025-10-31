import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
export async function adminLogin(email: string, password: string) {
  if (!email || !password) throw new Error('Email and password are required');
  const admin = await prisma.admin.findUnique({ where: { email } });
  const [user, company, worker] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.company.findUnique({ where: { email } }),
    prisma.worker.findUnique({ where: { email } }),
  ]);
  if (user || company || worker) {
    throw new Error('Unauthorized - Invalid role');
  }
  if (!admin) {
    throw new Error('Admin does not exist');
  }
  const passwordIsValid = await bcrypt.compare(password, admin.password);
  if (user || company || worker) {
    throw new Error('Email is associated with another account type');
  }
  if (!passwordIsValid) {
    throw new Error('Invalid password');
  }
  return admin;
}
