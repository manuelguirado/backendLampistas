import { Prisma, PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function listAssignedIncidents(
  workerid: number,
  search?: string,
  limit: number = 5,
  offset: number = 0,
) {
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
  try {
    const whereClause: Prisma.IncidentsWhereInput = {
      assignedWorkerID: workerid,
      status: { not: 'closed' },
      ...(search
        ? {
            OR: [
              {
                title: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
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

    const incidents = await prisma.incidents.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: { IncidentsID: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        assignedWorker: {
          select: {
            workerid: true,
            name: true,
          },
        },
      },
    });

    if (!incidents || incidents.length === 0) {
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
        reportedByUserID: incident.user?.name || null,
        assignedWorkerID: incident.assignedWorkerID,
        assignedWorker: incident.assignedWorker
          ? {
              workerid: incident.assignedWorker.workerid,
              name: incident.assignedWorker.name,
            }
          : null,
      };
    });
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
