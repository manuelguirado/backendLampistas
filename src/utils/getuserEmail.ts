import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();
import { UserType } from './types/userType';
export async function getEmail(id: number, userType: UserType) {
  switch (userType) {
    case 'user': {
      const user = await prisma.user.findUnique({
        where: { userID: id },
        select: { email: true },
      });
      return user?.email;
    }
    case 'admin': {
      const admin = await prisma.admin.findUnique({
        where: { adminID: id },
        select: { email: true },
      });
      return admin?.email;
    }
    case 'company': {
      const company = await prisma.company.findUnique({
        where: { companyID: id },
        select: { email: true },
      });
      return company?.email;
    }
    case 'worker': {
      const worker = await prisma.worker.findUnique({
        where: { workerid: id },
        select: { email: true },
      });
      return worker?.email;
    }
    default:
      throw new Error('Invalid user type');
  }
}
