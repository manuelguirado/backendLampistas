import { UserType } from './types/userType';
import { PrismaClient } from '../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { hashPassword } from './hash/hashPassword';
import dotenv from 'dotenv';
const prisma = new PrismaClient();
dotenv.config();

async function resolveUserTypeByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return { userType: 'user' as const, email };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (admin) {
    return { userType: 'admin' as const, email };
  }

  const company = await prisma.company.findUnique({ where: { email } });
  if (company) {
    return { userType: 'company' as const, email };
  }

  const worker = await prisma.worker.findUnique({ where: { email } });
  if (worker) {
    return { userType: 'worker' as const, email };
  }

  return null;
}
async function setNewPassword(
  userType: UserType,
  email: string,
  hashedPassword: string,
) {
  switch (userType) {
    case 'user': {
      const updateuUser = await prisma.user.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
      return updateuUser;
    }
    case 'admin': {
      const updateAdmin = await prisma.admin.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
      return updateAdmin;
    }
    case 'company': {
      const updateCompany = await prisma.company.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
      return updateCompany;
    }
    case 'worker': {
      const updateWorker = await prisma.worker.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
      return updateWorker;
    }
  }
}
export async function forgotPassword(newPassword: string, email: string) {
  const resolvedUser = await resolveUserTypeByEmail(email);
  if (!resolvedUser) {
    throw new Error('User not found');
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await setNewPassword(
    resolvedUser.userType,
    email,
    hashedPassword,
  );

  const secret = process.env.JWT_SECRET;
  const payload = { email: email, userType: resolvedUser.userType };
  const options: SignOptions = { expiresIn: '1h' };
  const token = jwt.sign(payload, secret!, options);
  return { token, newPassword: updatedUser.password };
}
