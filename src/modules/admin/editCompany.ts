import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function editCompany(
  companyID: number,
  update: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  },
) {
  {
    if (!companyID) {
      throw new Error('Company ID is required');
    }
    if (Object.keys(update).length === 0) {
      throw new Error('At least one field to update must be provided');
    }

    const existingCompany = await prisma.company.findUnique({
      where: { companyID: companyID },
    });

    if (!existingCompany) {
      throw new Error('Company not found');
    }
    const updatedCompany = await prisma.company.update({
      where: { companyID: companyID },
      data: {
        ...update,
      },
    });

    return updatedCompany;
  }
}
