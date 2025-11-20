import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function assingCompanyToUser(companyID: number, userID?: number) {
  if (!companyID || !userID) {
    throw new Error('companyID and userID are required');
  }
  const user = await prisma.user.findUnique({
    where: { userID },
  });
  if (!user) {
    throw new Error('User does not exist');
  }
  const company = await prisma.company.findUnique({
    where: { companyID },
  });
  if (!company) {
    throw new Error('Company does not exist');
  }
  const updatedUser = await prisma.user.update({
    where: { userID },
    data: { companyID },
  });
  return updatedUser;
}
