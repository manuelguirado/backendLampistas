import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function consultStatus(companyID: number) {
  if (!companyID) {
    throw new Error('companyID is required');
  }

  const company = await prisma.company.findUnique({
    where: { companyID: companyID },
  });

  if (!company) {
    throw new Error('Company does not exist');
  }
  return company.suspended;
}
