import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function assignShiftWorker(
  workerID: number,
  shiftSchedule: Date,
  shiftType: string,
) {
  if (!workerID || !shiftSchedule || !shiftType) {
    throw new Error(
      'shiftID, workerID, shiftSchedule and shiftType are required',
    );
  }

  const worker = await prisma.worker.findUnique({
    where: { workerid: workerID },
  });
  if (!worker) {
    throw new Error('Worker does not exist');
  }
  const assignedShift = await prisma.shiftSchedule.create({
    data: {
      workerID,
      shiftSchedule,
      shiftType,
    },
  });
  return assignedShift;
}
