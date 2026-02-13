import { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '../../../generated/prisma';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function getDirections(workerID: number, incidentID?: number) {
  const worker = await prisma.worker.findUnique({
    where: { workerid: workerID },
    select: {
      companyID: true,
    },
  });
  if (!worker) {
    throw new Error('Worker not found');
  }
  const user = await prisma.company.findFirst({
    where: { companyID: worker.companyID },
    select: { userID: true },
  });
  const incident = await prisma.directions.findMany({
    where: { incidentID: incidentID },
  });

  console.log('incident ', incident);
  if (!incident) {
    throw new Error('Incident not found');
  }
  if (!user) {
    throw new Error('Company not found');
  }
  const fullAddress = `${incident[0].address}, ${incident[0].city}, ${incident[0].state}, ${incident[0].zipCode}`;

  const token = process.env.JWT_SECRET;
  const options: SignOptions = { expiresIn: '1h' };
  const payload = { workerID };
  const jwtToken = jwt.sign(payload, token!, options);
  return { fullAddress, token: jwtToken };
}
