import { PrismaClient } from '../../generated/prisma';
import { PaymentStatus } from './types/paymentStatus';
const prisma = new PrismaClient();

export async function savePayment(
  paymentID: string,
  companyID: number,
  userID: number,
  amount: number,
  status: PaymentStatus,
  date: Date,
  clientEmail: string,
  incidentID?: number,
) {
  return await prisma.payments.create({
    data: {
      paymentID,
      companyID,
      userID,
      amount,
      date,
      IncidentsID: incidentID,
      receivedByID: userID,
      clientEmail: clientEmail,
      paymentStatus: {
        create: {
          status: status.toUpperCase() as any, // Ensure enum matches Prisma's expected value
        },
      },
    },
  });
}
