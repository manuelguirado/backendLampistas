import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function getSubscribers() {
  const subscribers = await prisma.newsLetter.findMany({
    select: {
      email: true,
    },
  });
  return subscribers;
}
