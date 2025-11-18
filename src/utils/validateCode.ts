import { UserType } from './types/userType';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

export async function validateCode(
  userType: UserType,
  id: number,
  code: string,
) {
  if (!id || !code) {
    throw new Error('ID and code are required');
  }

  switch (userType) {
    case 'company': {
      const company = await prisma.company.findFirst({
        where: {
          companyID: id,
          companyCode: code,
        },
      });
      return company !== null;
    }
    case 'user': {
      const user = await prisma.user.findFirst({
        where: {
          userID: id,
          userCode: code,
        },
      });
      return user !== null;
    }
    case 'worker': {
      const worker = await prisma.worker.findFirst({
        where: {
          workerid: id,
          workerCode: code,
        },
      });
      return worker !== null;
    }
    default:
      throw new Error(`Invalid user type `);
  }
}
