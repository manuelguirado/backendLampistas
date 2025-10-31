import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function verifyPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return false;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}
