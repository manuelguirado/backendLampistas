import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
import { hashPassword } from '../../utils/hash/hashPassword';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

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
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
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
      where: { adminID: requesterId },
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
      role: 'ADMIN',
    },
  });

  try {
    const payload = {
      adminID: admin.adminID,
      role: admin.role,
      email: admin.email,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...admin };
  } catch (error) {
    throw new Error('Error generating JWT' + (error as Error).message);
  }
}
