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
  const whereClause = search
    ? {
        companyID: companyID,
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
    : { companyID: companyID };

  const totalIncidents = await prisma.incidents.count({
    where: whereClause,
  });

  const incidents = await prisma.incidents.findMany({
    where: whereClause,
    take: limit,
    skip: offset,
    orderBy: { IncidentsID: 'desc' },
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
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
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
