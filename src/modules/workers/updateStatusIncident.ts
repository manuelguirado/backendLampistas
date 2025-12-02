import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { incidentStatus } from '../../utils/types/incidentStatus';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function updateStatusIncident(
  incidentID: number,
  status: incidentStatus,
) {
  if (!incidentID || !status) {
    throw new Error('Incident ID and status are required');
  }
  const incident = await prisma.incidents.findUnique({
    where: { IncidentsID: incidentID },
  });

  if (!incident) {
    throw new Error('Incident not found');
  }
  const updatedIncident = await prisma.incidents.update({
    where: { IncidentsID: incidentID },
    data: { status: status },
  });
  try {
    const payload = {
      incidentID: updatedIncident.IncidentsID,
      status: updatedIncident.status,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...updatedIncident };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
