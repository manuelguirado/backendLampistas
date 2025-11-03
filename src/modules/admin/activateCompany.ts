import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function activateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const activatedCompany = await prisma.company.update({
    where: { companyID: companyID },
    data: {
      suspended: false,
      suspendedUntil: null,
    },
  });
  return activatedCompany;
}
