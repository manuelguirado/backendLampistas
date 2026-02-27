import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
import dotenv from 'dotenv';

import jwt, { SignOptions } from 'jsonwebtoken';
dotenv.config({ path: '../../../.env' });

const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export async function userLogin(email: string, password: string) {
  if (!email || !password) throw new Error('Email and password are required');
  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (attempt && attempt.lockUntil && attempt.lockUntil > now) {
    throw new Error('Account locked. Try again later');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User does not exist');

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    throw new Error('Invalid password');
  }

  // Validar que el rol es USER
  if (user.role !== 'USER') {
    throw new Error('Unauthorized');
  }
  try {
    const payload = {
      userID: user.userID,
      role: user.role,
      email: user.email,
      username: user.name,
      companyID: user.companyID,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1d' };
    const token = jwt.sign(payload, secret, options);

    loginAttempts.delete(email);
    return { token, ...user };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
