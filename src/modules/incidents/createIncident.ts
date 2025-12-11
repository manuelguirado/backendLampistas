import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function createIncident(
  title: string,
  description: string,
  location: string,
  userID: number,
  companyID: number,

  priority?: string,
  urgency?: boolean,
) {
  if (!title || !description || !companyID) {
    throw new Error('Title, description, companyID, and workerID are required');
  }

  const foundCompany = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!foundCompany) {
    throw new Error('Company not found');
  }

  const user = await prisma.user.findUnique({
    where: { userID: userID }, // ✅ userID en lugar de id
  });
  if (!user) {
    throw new Error('User not found');
  }

  // ✅ Crear incidencia
  const incident = await prisma.incidents.create({
    data: {
      title,
      description,
      location,
      userID, // ✅ Changed to userId to match Prisma schema
      companyID,

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
