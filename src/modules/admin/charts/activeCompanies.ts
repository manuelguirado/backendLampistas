import { PrismaClient } from '../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export default async function activeCompanies(adminID: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        adminID: adminID,
      },
    });

    if (!admin) {
      throw new Error('Admin not found');
    }
    const companies = await prisma.adminsCompanies.findMany({
      where: {
        adminID: adminID,
      },
      select: {
        companyID: true,
      },
    });
    const activeCompany = await prisma.company.findMany({
      where: {
        companyID: {
          in: companies.map((c) => c.companyID),
        },
        suspended: false,
      },
    });

    // Array de 12 meses inicializado a 0
    const monthlyCompanies = new Set<number>();
    let totalCompanies = 0;

    activeCompany.forEach(() => {
      totalCompanies += 1;
      monthlyCompanies.add(activeCompany[0].companyID);
    });
    const payload = {
      adminID: adminID,
    };
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);

    return {
      totalCompanies,
      monthlyCompanies,
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching company earnings');
  }
}
