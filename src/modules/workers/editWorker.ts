import { PrismaClient, Role } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function editWorker(
  workerID: number,
  update: { name?: string; email?: string; role?: Role; companyid?: number },
) {
  if (!workerID || !update) {
    throw new Error('workerID and update data are required');
  }

  const existingWorker = await prisma.worker.findUnique({
    where: { workerid: workerID },
  });
  if (!existingWorker) {
    throw new Error('Worker not found');
  }
  const updateWorker = await prisma.worker.update({
    where: { workerid: workerID },
    data: update,
  });
  return updateWorker;
}
