import { PrismaClient } from '../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
import { generateCode } from '../../utils/generateCode';
const prisma = new PrismaClient();
export async function userRegister(
  email: string,
  password: string,
  code?: string,
) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await hashPassword(password);
  const userCode = code || generateCode();

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      userCode,
      role: 'USER',
    },
  });
}
