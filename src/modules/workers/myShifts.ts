import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function myShifts(
  workerID: number,
  startDate?: Date,
  endDate?: Date,
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
      startDate: startDate,
      endDate: endDate,
      shiftType: shiftType,
    },
  });

  if (!shifts || shifts.length === 0) {
    return [];
  }

  const mappedShifts = shifts.map(
    (shift: {
      workerID: number;
      startDate: Date;
      endDate: Date;
      shiftType: string;
    }) => ({
      workerID: shift.workerID,
      startDate: shift.startDate,
      endDate: shift.endDate,
      shiftType: shift.shiftType,
    }),
  );

  try {
    const payload = { workerID: worker.workerid, companyID: worker.companyID };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, shifts: mappedShifts };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
