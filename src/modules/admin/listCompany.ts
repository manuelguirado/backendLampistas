import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function listCompany(adminID: number) {
  if (!adminID) {
    throw new Error('adminID is required');
  }

  const admin = await prisma.admin.findUnique({
    where: { adminID: adminID },
  });

  if (!admin) {
    throw new Error('Admin does not exist');
  }
  const companies = await prisma.company.findMany();

  if (!companies) {
    return [];
  }

  const mappedCompanies = companies.map((company) => {
    return {
      companyID: company.companyID,
      name: company.name,
      email: company.email,
      phone: company.phone,
    };
  });

  return mappedCompanies;
}
