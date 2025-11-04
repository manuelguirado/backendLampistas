import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function myShifts(
  workerID: number,
  shiftSchedule?: Date,
  shiftType?: string,
) {
  if (!workerID) {
    throw new Error('Worker ID is required');
  }
  const worker = await prisma.worker.findUnique({
    where: { workerid: workerID },
  });

  if (!worker) {
    throw new Error('Worker not found');
  }
  const shifts = await prisma.shiftSchedule.findMany({
    where: {
      workerID: workerID,
      shiftSchedule: shiftSchedule,
      shiftType: shiftType,
    },
  });

  if (!shifts || shifts.length === 0) {
    return [];
  }

  const mappedShifts = shifts.map(
    (shift: { workerID: number; shiftSchedule: Date; shiftType: string }) => ({
      workerID: shift.workerID,
      shiftSchedule: shift.shiftSchedule,
      shiftType: shift.shiftType,
    }),
  );

  return mappedShifts;
}
