import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function listWorkers(
  companyID: number,
  limit: number = 5,
  offset: number = 0,
) {
  if (!companyID) {
    throw new Error('companyID is required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!company) {
    throw new Error('Company does not exist');
  }
  // Obtener el total de clientes asociados a la compañía
  const totalClients = await prisma.user.count({
    where: { companyID: companyID },
  });
  const workers = await prisma.worker.findMany({
    where: { companyID: companyID },
    take: limit,
    skip: offset,
    orderBy: { workerid: 'desc' },
    include: {
      assignedIncidents: {
        select: {
          IncidentsID: true,
          title: true,
          status: true,
          priority: true,
          urgency: true,
          createdAt: true,
        },
      },
    },
  });
  if (!workers) {
    return [];
  }
  const mappedWorkers = workers.map((worker) => {
    return {
      workerid: worker.workerid,
      name: worker.name ?? '',
      email: worker.email,
      activeIncidents: worker.assignedIncidents || [],
    };
  });
  try {
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      token,
      workers: mappedWorkers,
      total: totalClients,
    };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
