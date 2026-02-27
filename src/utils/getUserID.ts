import type { UserType } from './types/userType';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
export async function getUserID(userType: UserType, id: number) {
  switch (userType) {
    case 'user':
      return prisma.user.findUnique({ where: { userID: id } });
    case 'admin':
      return prisma.admin.findUnique({ where: { adminID: id } });
    case 'worker':
      return prisma.worker.findUnique({ where: { workerid: id } });
    case 'company':
      return prisma.company.findUnique({ where: { companyID: id } });
    default:
      throw new Error('Invalid user type');
  }
}
