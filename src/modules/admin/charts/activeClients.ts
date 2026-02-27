import { PrismaClient } from '../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export default async function activeClients(adminID: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        adminID: adminID,
      },
    });

    if (!admin) {
      throw new Error('Admin not found');
    }
    const company = await prisma.adminsCompanies.findFirst({
      where: {
        adminID: adminID,
      },
      select: {
        companyID: true,
      },
    });

    if (!company) {
      throw new Error('Company not found for this admin');
    }
    const clients = await prisma.user.findMany({
      where: {
        companyID: company.companyID,
      },
      select: {
        userID: true,
      },
    });
    // Array de 12 meses inicializado a 0

    let totalClients = 0;
    const monthlyCompanies = new Set<number>();

    clients.forEach(() => {
      totalClients += 1;
      monthlyCompanies.add(company.companyID);
    });
    const payload = {
      adminID: admin.adminID,
    };
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);

    return {
      totalClients,
      monthlyCompanies: Array.from(monthlyCompanies),
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching active clients');
  }
}
