import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

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
    const count = attempt ? attempt.count + 1 : 1;
    let lockUntil = 0;
    if (count >= MAX_ATTEMPTS) {
      lockUntil = now + LOCK_TIME;
    }
    loginAttempts.set(email, { count, lockUntil });
    if (lockUntil) {
      throw new Error('Account locked. Try again later');
    }
    throw new Error('Invalid password');
  }

  // Validar que el rol es USER
  if (user.role !== 'USER') {
    throw new Error('Unauthorized');
  }

  // Login correcto: resetea contador
  loginAttempts.delete(email);

  return user;
}
