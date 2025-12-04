import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { incidentStatus } from '../../utils/types/incidentStatus';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function createIncident(
  title: string,
  description: string,
  location: string,
  userID: number,
  companyID: number,
  status?: incidentStatus,
  priority?: string,
  urgency?: boolean,
) {
  console.log('Creating incident with:', {
    title,
    description,
    location,
    userID,
    companyID,
    status,
    priority,
    urgency,
  });
  if (!title || !description || !companyID) {
    throw new Error('Title, description, companyID, and workerID are required');
  }

  const foundCompany = await prisma.company.findUnique({
    where: { companyID: companyID },
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

  const finalStatus = status || 'OPEN';

  // ✅ Crear incidencia
  const incident = await prisma.incidents.create({
    data: {
      title,
      description,
      location,
      userID, // ✅ Changed to userId to match Prisma schema
      companyID,
      status: finalStatus.toLowerCase() as incidentStatus,
      priority: priority || (urgency ? 'HIGH' : 'MEDIUM'),
      urgency: urgency || false,
    },
  });

  try {
    const payload = {
      incidentID: incident.IncidentsID,
      companyID: companyID,
      role: foundCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...incident };
  } catch (error) {
    console.error('Error generating JWT token:', error);
  }
}
