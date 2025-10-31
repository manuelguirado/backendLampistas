import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
export async function loginAdmin(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // ✅ PRIMERO: Verificar si email existe en OTRAS tablas
  // ✅ Verificar que el email no esté en uso en NINGUNA tabla
  const [existingUser, existingCompany, existingWorker] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.company.findUnique({ where: { email } }),
    prisma.worker.findUnique({ where: { email } }),
  ]);

  if (existingUser || existingCompany || existingWorker) {
    throw new Error('this email is already registered by another role');
  }

  // ✅ SEGUNDO: Buscar admin
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new Error('Admin not found');
  }

  // ✅ TERCERO: Verificar password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return admin;
}
