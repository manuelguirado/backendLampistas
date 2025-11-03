import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function findMyMachinery(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const machineryList = await prisma.machinery.findMany({
    where: { companyID: companyID },
  });
  return machineryList;
}
