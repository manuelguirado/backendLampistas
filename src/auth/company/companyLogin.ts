import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export async function companyLogin(email: string, password: string) {
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60 * 1000;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // 1. Verificar intentos fallidos
  const userAttempts = failedAttempts.get(email);
  const now = new Date();

  if (userAttempts && userAttempts.count >= MAX_ATTEMPTS) {
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
      failedAttempts.delete(email);
    }
  }

  // 2. Buscar primero en companies
  const company = await prisma.company.findUnique({
    where: { email },
  });

  // Si no existe en companies, verificar si es un user intentando acceder
  if (!company) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Es un user intentando acceder como company
      recordFailedAttempt(email);
      throw new Error('Unauthorized - Invalid role');
    }

    // No existe en ninguna tabla
    recordFailedAttempt(email);
    throw new Error('Company not found');
  }

  // 3. Verificar rol de la company
  if (company.role !== 'COMPANY') {
    recordFailedAttempt(email);
    throw new Error('Unauthorized - Invalid role');
  }

  // 4. Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, company.password);
  if (!isPasswordValid) {
    recordFailedAttempt(email);
    throw new Error('Invalid password');
  }

  // 5. Login exitoso
  failedAttempts.delete(email);
  return company;
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
