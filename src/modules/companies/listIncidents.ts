import { PrismaClient, Prisma } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function listIncidents(
  companyID: number,
  search?: string,
  limit: number = 5,
  offset: number = 0,
) {
  if (!companyID) {
    throw new Error('companyID is required');
  }

  const whereClause: Prisma.IncidentsWhereInput = {
    companyID: companyID,
    status: { not: 'closed' },
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}),
  };

  const totalIncidents = await prisma.incidents.count({
    where: whereClause,
  });

  const incidents = await prisma.incidents.findMany({
    where: whereClause,
    take: limit,
    skip: offset,
    orderBy: { IncidentsID: 'desc' },
    include: {
      assignedWorker: {
        select: {
          workerid: true,
          name: true,
        },
      },
    },
  });

  if (!incidents) {
    return [];
  }
  const mappedIncidents = incidents.map((incident) => {
    return {
      IncidentsID: incident.IncidentsID,
      title: incident.title,
      description: incident.description,
      status: incident.status,
      priority: incident.priority,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      assignedWorkerID: incident.assignedWorkerID,
      assignedWorker: incident.assignedWorker
        ? {
            workerid: incident.assignedWorker.workerid,
            name: incident.assignedWorker.name,
          }
        : null,
    };
  });

  try {
    const payload = { companyID: companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, incidents: mappedIncidents, total: totalIncidents };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
