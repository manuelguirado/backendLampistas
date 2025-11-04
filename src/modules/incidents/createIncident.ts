import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function createIncident(
  title: string,
  description: string,
  userID: number,
  companyID: number,
  status?: string,
  priority?: string,
  urgency?: boolean,
) {
  if (!title || !description || !companyID) {
    throw new Error('Title, description, companyID, and workerID are required');
  }

  const foundCompany = await prisma.company.findUnique({
    where: { companyID },
  });
  if (!foundCompany) {
    throw new Error('Company not found');
  }

  // ✅ CORRECTO - Buscar por userID, no por id
  const user = await prisma.user.findUnique({
    where: { userID: userID }, // ✅ userID en lugar de id
  });
  if (!user) {
    throw new Error('User not found');
  }

  let finalStatus = status || 'OPEN';
  if (urgency) {
    finalStatus = 'URGENT';
  }

  // ✅ Crear incidencia
  const incident = await prisma.incidents.create({
    data: {
      title,
      description,
      userID, // ✅ Changed to userId to match Prisma schema
      companyID,
      status: finalStatus,
      priority: priority || (urgency ? 'HIGH' : 'MEDIUM'),
      urgency: urgency || false,
    },
  });

  return incident;
}
