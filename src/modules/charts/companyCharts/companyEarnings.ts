import { PrismaClient } from '../../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export default async function companyEarnings(companyID: number) {
  try {
    const payments = await prisma.payments.findMany({
      where: {
        companyID: companyID,
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Array de 12 meses inicializado a 0
    const monthlyEarnings = Array(12).fill(0);
    let totalEarnings = 0;

    payments.forEach((payment) => {
      totalEarnings += payment.amount.toNumber();
      const date = new Date(payment.date);
      const month = date.getMonth(); // 0 = Enero, 11 = Diciembre
      const amount = payment.amount.toNumber();
      monthlyEarnings[month] += amount;
    });
    const payload = {
      companyID: companyID,
    };
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);

    return {
      totalEarnings,
      monthlyEarnings,
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching company earnings');
  }
}
