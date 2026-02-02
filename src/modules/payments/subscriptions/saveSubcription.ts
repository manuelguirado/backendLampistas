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
  console.log('Saving subscription to DB:', {
    companyemail,
    startDate,
    subscriptionID,
    active,
    endDate,
  });
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
