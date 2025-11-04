import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function eliminateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!company) {
    throw new Error('Company not found');
  }
  await prisma.adminsCompanies.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar la compañía
  await prisma.company.delete({
    where: { companyID: companyID },
  });
  await prisma.directions.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar trabajadores asociados a la compañía
  await prisma.worker.deleteMany({
    where: { companyID: companyID },
  });
}
