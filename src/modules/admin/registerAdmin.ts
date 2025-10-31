import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
import { hashPassword } from '../../utils/hash/hashPassword';

export default async function registerAdmin(
  email: string,
  password: string,
  requesterId?: number,
) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // ✅ Verificar que no existe ya como admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingAdmin) {
    throw new Error('Admin already exists');
  }

  // ✅ Verificar que el email no esté en uso en NINGUNA tabla
  const [existingUser, existingCompany, existingWorker] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.company.findUnique({ where: { email } }),
    prisma.worker.findUnique({ where: { email } }),
  ]);

  if (existingUser || existingCompany || existingWorker) {
    throw new Error('User with this email already exists');
  }

  // ✅ Verificar que quien hace la request es admin (si se proporciona requesterId)
  if (requesterId) {
    const requester = await prisma.admin.findUnique({
      where: { id: requesterId },
    });
    if (!requester) {
      throw new Error('Only existing admins can create new admins');
    }
  }

  // ✅ Hash password y crear admin
  const hashedPassword = await hashPassword(password);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN', // Explícito
    },
  });

  return admin;
}
