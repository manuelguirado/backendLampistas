import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const failedAttempts = new Map<
  string,
  { count: number; firstAttemptTime: number }
>();

export async function workerLogin(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // 1. Verificar intentos fallidos PRIMERO
  const userAttempts = failedAttempts.get(email);
  const now = new Date();

  if (userAttempts && userAttempts.count >= MAX_ATTEMPTS) {
    const timeSinceLastAttempt = now.getTime() - userAttempts.firstAttemptTime;
    if (timeSinceLastAttempt < BLOCK_TIME_MS) {
      const remainingTime = Math.ceil(
        (BLOCK_TIME_MS - timeSinceLastAttempt) / 60000,
      );
      throw new Error(
        `Too many login attempts. Please try again in ${remainingTime} minutes.`,
      );
    } else {
      failedAttempts.delete(email);
    }
  }

  // 2. Buscar worker
  const worker = await prisma.worker.findUnique({
    where: { email },
  });

  if (!worker) {
    recordFailedAttempt(email);
    throw new Error('Worker does not exist'); // ✅ Mensaje consistente con el test
  }

  // 3. Verificar contraseña con bcrypt directamente
  const isPasswordValid = await bcrypt.compare(password, worker.password);

  if (!isPasswordValid) {
    recordFailedAttempt(email);
    throw new Error('Invalid password');
  }

  // 4. Login exitoso - limpiar intentos fallidos
  failedAttempts.delete(email);
  return worker;
}

function recordFailedAttempt(email: string) {
  const current = failedAttempts.get(email) || {
    count: 0,
    firstAttemptTime: Date.now(),
  };
  failedAttempts.set(email, {
    count: current.count + 1,
    firstAttemptTime: current.firstAttemptTime,
  });
}
