import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function listWorker(companyID: number) {
  if (!companyID) {
    throw new Error('companyID is required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID },
  });
  if (!company) {
    throw new Error('Company does not exist');
  }
  const workers = await prisma.worker.findMany({
    where: { companyID },
  });
  if (!workers) {
    return [];
  }
  const mapWorkers = workers.map((worker) => {
    return {
      workerID: worker.workerid,
      email: worker.email,
      name: worker.name,
      companyID: worker.companyID,
    };
  });
  return mapWorkers;
}
