import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function listAssignedIncidents(workerid: number) {
  if (!workerid) {
    throw new Error('Worker ID is required');
  }

  const company = await prisma.company.findFirst({
    where: { workers: { some: { workerid: workerid } } },
  });

  if (!company) {
    throw new Error('Worker does not belong to any company');
  }

  const worker = await prisma.worker.findUnique({
    where: { workerid: workerid },
  });

  if (!worker) {
    throw new Error('Worker not found');
  }

  const incidents = await prisma.incidents.findMany({
    where: { assignedWorkerID: workerid },
    orderBy: { createdAt: 'asc' },
  });
  if (!incidents || incidents.length === 0) {
    return [];
  }
  const mappedIncidents = incidents.map((incident) => ({
    IncidentsID: incident.IncidentsID,
    title: incident.title,
    description: incident.description,
    dateReported: incident.createdAt,
    status: incident.status,
    companyID: incident.companyID,
    reportedByUserID: incident.userID,
    priority: incident.priority,
  }));
  try {
    const payload = { workerid: worker.workerid, role: worker.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { assignedIncidents: mappedIncidents, token };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
