import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function assignShiftWorker(
  workerID: number,
  startDate: Date,
  endDate: Date,
  shiftType: string,
) {
  if (!workerID || !startDate || !endDate || !shiftType) {
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
      startDate,
      endDate,
      shiftType,
    },
  });
  try {
    const payload = { workerID: worker.workerid, role: worker.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...assignedShift };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error(`Internal server error ${error}`);
  }
}
