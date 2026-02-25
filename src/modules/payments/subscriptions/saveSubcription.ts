import { PrismaClient } from '../../../../generated/prisma';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
export default async function saveSubcriptionInDB(
  companyemail: string,
  startDate: Date,
  active: boolean,
  subscriptionID: string,
  endDate?: Date,
) {
  return prisma.subscription.create({
    data: {
      companyemail,
      startDate,

      active,
      subscriptionID: subscriptionID,
      endDate,
    },
  });
}
