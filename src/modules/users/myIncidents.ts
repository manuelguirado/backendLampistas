import { PrismaClient } from '../../../generated/prisma';
import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';

dotenv.config();
const prisma = new PrismaClient();
export async function myIncidents(
  userID: number,
  limit?: number,
  offset?: number,
) {
  if (!userID) {
    throw new Error('User ID is required to fetch incidents.');
  }
  const user = await prisma.user.findUnique({
    where: { userID: userID },
  });
  if (!user) {
    throw new Error('User does not exist.');
  }
  const incidents = await prisma.incidents.findMany({
    where: {
      userID: userID,
    },
    take: limit,
    skip: offset,
    orderBy: {
      dateReported: 'desc',
    },
  });
  const mappedIncidents = incidents.map((incident) => ({
    IncidentsID: incident.IncidentsID,
    title: incident.title,
    description: incident.description,
    status: incident.status,
    priority: incident.priority,
    dateReported: incident.dateReported,
    assignedWorkerID: incident.assignedWorkerID,
  }));
  const payload = { userID: user.userID, role: user.role };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: '1h' };
  const token = jwt.sign(payload, secret, options);
  return { token, incidents: mappedIncidents };
}
