import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
const prisma = new PrismaClient();
export async function userRegister(
  name: string,
  email: string,
  password: string,
  CompanyID?: number,
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

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      Company: {
        connect: { companyID: CompanyID },
      },
    },
  });
}
