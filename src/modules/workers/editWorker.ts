import { PrismaClient, Role } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
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

  try {
    const payload = {
      workerID: updateWorker.workerid,
      role: updateWorker.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...updateWorker };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
