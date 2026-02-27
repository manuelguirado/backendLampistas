import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
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
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  const passwordIsValid = await bcrypt.compare(password, admin.password);
  if (user || company || worker) {
    throw new Error('Email is associated with another account type');
  }

  if (!passwordIsValid) {
    throw new Error('Invalid password');
  }
  try {
    const payload = {
      adminID: admin.adminID,
      role: admin.role,
      email: admin.email,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1d' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...admin };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
