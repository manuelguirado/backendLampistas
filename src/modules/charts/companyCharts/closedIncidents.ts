import { PrismaClient } from '../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export default async function closedIncidents(companyID: number) {
  try {
    const incident = await prisma.incidents.findMany({
      where: {
        companyID: companyID,
        status: 'closed',
      },
    });

    // Array de 12 meses inicializado a 0
    const monthlyIncidents = Array(12).fill(0);
    let totalIncidents = 0;
    incident.forEach((payment) => {
      totalIncidents += 1;
      const date = new Date(payment.createdAt);
      const month = date.getMonth(); // 0 = Enero, 11 = Diciembre
      monthlyIncidents[month] += 1;
    });

    const payload = {
      companyID: companyID,
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
    throw new Error('Error fetching company earnings');
  }
}
