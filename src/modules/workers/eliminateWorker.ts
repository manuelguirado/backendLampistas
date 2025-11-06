import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
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
  try {
    const payload = {
      workerid: existingWorker.workerid,
      role: existingWorker.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, message: 'Worker deleted successfully' };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
