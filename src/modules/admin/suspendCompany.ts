import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function suspendCompany(companyID: number, suspendAt?: Date) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const suspendCompany = await prisma.company.update({
    where: { companyID: companyID },
    data: {
      suspended: true,
      suspendedUntil: suspendAt ?? null,
    },
  });
  return suspendCompany;
}
