import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function listWorker(companyID: number) {
  if (!companyID) {
    throw new Error('companyID is required');
  }

  const workers = await prisma.worker.findMany({
    where: { companyID },
  });
  return workers;
}
