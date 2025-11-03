import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function eliminateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  // Eliminar la compañía
  await prisma.company.delete({
    where: { companyID: companyID },
  });
  // Eliminar trabajadores asociados a la compañía
  await prisma.worker.deleteMany({
    where: { companyID: companyID },
  });
}
