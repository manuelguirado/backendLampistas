import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function eliminateWorker(workerid: number) {
  if (!workerid) {
    throw new Error('workerid is required');
  }
  const existingWorker = await prisma.worker.findUnique({
    where: { workerid: workerid },
  });
  if (!existingWorker) {
    throw new Error('Worker not found');
  }
  await prisma.worker.delete({
    where: { workerid: workerid },
  });
  return { message: 'Worker deleted successfully' };
}
