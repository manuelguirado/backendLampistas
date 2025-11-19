import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function listClients(
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
  const clients = await prisma.user.findMany({
    where: { companyID: companyID },
    take: limit,
    skip: offset,
    orderBy: { userID: 'desc' },
  });
  if (!clients) {
    return [];
  }
  const userMachinery = await prisma.machinery.findMany({
    where: {
      companyID: companyID,
      clientID: { in: clients.map((c) => c.userID) },
    },
  });
  const mappedClients = clients.map((client) => {
    return {
      userID: client.userID,
      name: client.name ?? '',
      email: client.email,
      acttiveIncidents: Array.isArray(client.incidentsID)
        ? client.incidentsID
        : client.incidentsID !== null && client.incidentsID !== undefined
          ? [client.incidentsID]
          : [],
    };
  });
  try {
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      token,
      clients: mappedClients,
      total: totalClients,
      userMachinery,
    };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
