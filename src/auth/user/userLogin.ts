import { PrismaClient } from '../../../generated/prisma';
import { verifyPassword } from '../../utils/hash/verifyPassword';

const prisma = new PrismaClient();

// Storage para intentos fallidos (en producción usar Redis o base de datos)
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export async function userLogin(email: string, password: string) {
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Verificar intentos fallidos para este email
  const userAttempts = failedAttempts.get(email);
  const now = new Date();

  if (userAttempts) {
    // Si el usuario está bloqueado y no ha pasado el tiempo de bloqueo
    if (userAttempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt =
        now.getTime() - userAttempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil(
          (LOCKOUT_TIME - timeSinceLastAttempt) / 60000,
        );
        throw new Error(
          `Too many login attempts. Please try again in ${remainingTime} minutes.`,
        );
      } else {
        // Reset counter after lockout time
        failedAttempts.delete(email);
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Registrar intento fallido
    recordFailedAttempt(email);
    throw new Error('User does not exist');
  }

  if (user.role !== 'USER') {
    recordFailedAttempt(email);
    throw new Error('Unauthorized');
  }

  const isPasswordValid = await verifyPassword(email, password);
  if (!isPasswordValid) {
    // Registrar intento fallido
    recordFailedAttempt(email);
    throw new Error('Invalid password');
  }

  // Login exitoso - limpiar intentos fallidos
  failedAttempts.delete(email);

  return user;
}

function recordFailedAttempt(email: string) {
  const current = failedAttempts.get(email) || {
    count: 0,
    lastAttempt: new Date(),
  };
  failedAttempts.set(email, {
    count: current.count + 1,
    lastAttempt: new Date(),
  });
}
