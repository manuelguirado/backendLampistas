import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
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
  try {
    const payload = { companyID: company.companyID };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, workers: mapWorkers };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
