import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export async function companyLogin(email: string, password: string) {
  if (!email || !password) throw new Error('Email and password are required');

  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (attempt && attempt.lockUntil && attempt.lockUntil > now) {
    throw new Error('Account locked. Try again later');
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.role !== 'COMPANY') {
    throw new Error('Unauthorized - Invalid role');
  }

  const company = await prisma.company.findUnique({ where: { email } });
  if (!company) {
    throw new Error('Company not found');
  }

  const passwordIsValid = await bcrypt.compare(password, company.password);

  if (!passwordIsValid) {
    const count = attempt ? attempt.count + 1 : 1;
    let lockUntil = 0;
    if (count >= MAX_ATTEMPTS) {
      lockUntil = now + LOCK_TIME;
    }
    loginAttempts.set(email, { count, lockUntil });
    if (lockUntil) throw new Error('Account locked. Try again later');
    throw new Error('Invalid password');
  }
  try {
    const payload = {
      companyID: company.companyID,
      role: company.role,
      email: company.email,
      name: company.name,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    loginAttempts.delete(email);
    return { token, ...company };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
