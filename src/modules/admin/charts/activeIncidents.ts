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

    const incidents = await prisma.incidents.findMany({
      where: {
        companyID: {
          in: companies.map((c) => c.companyID),
        },
        status: 'open',
      },
      select: {
        IncidentsID: true,
        createdAt: true,
      },
    });

    // Array de 12 meses inicializado a 0
    const monthlyIncidents = Array(12).fill(0);
    let totalIncidents = 0;

    incidents.forEach((incident) => {
      totalIncidents += 1;
      const date = new Date(incident.createdAt);
      const month = date.getMonth(); // 0 = Enero, 11 = Diciembre
      monthlyIncidents[month] += 1;
    });
    const payload = {
      adminID: adminID,
    };
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);

    return {
      totalIncidents,
      monthlyIncidents,
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching active incidents');
  }
}
