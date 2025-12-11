import { UserType } from '../utils//types/userType';
import { PrismaClient } from '../../generated/prisma';
import { generateCode } from '../utils/generateCode';

const prisma = new PrismaClient();
export async function assignCode(UserType: UserType, id: number) {
  const code = generateCode();
  switch (UserType) {
    case 'company':
      if (!id) throw new Error('Company ID is required for company user type');
      await prisma.company.update({
        where: { companyID: id },
        data: { companyCode: code },
      });
      break;
    case 'worker':
      if (!id) throw new Error('Worker ID is required for worker user type');
      await prisma.worker.update({
        where: { workerid: id },
        data: { workerCode: code },
      });
      break;
    case 'user':
      if (!id) throw new Error('User ID is required for user user type');
      await prisma.user.update({
        where: { userID: id },
        data: { userCode: code },
      });
      break;
    default:
      throw new Error('Invalid UserType');
  }
  return { message: 'Code assigned successfully', code };
}
