import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function assignIncident(incidentID: number, workerID: number) {
  if (!incidentID || !workerID) {
    throw new Error('Incident ID and Worker ID are required');
  }

  // Verificar que la incidencia existe
  const incident = await prisma.incidents.findUnique({
    where: { IncidentsID: incidentID },
  });
  if (!incident) {
    throw new Error('Incident not found');
  }

  // Verificar que el trabajador existe
  const worker = await prisma.worker.findUnique({
    where: { workerid: workerID },
  });
  if (!worker) {
    throw new Error('Worker not found');
  }

  // Asignar el trabajador a la incidencia
  const updatedIncident = await prisma.incidents.update({
    where: { IncidentsID: incidentID },
    data: { assignedWorkerID: workerID },
  });

  try {
    const payload = {
      incidentID: updatedIncident.IncidentsID,
      workerID: worker.workerid,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...updatedIncident };
  } catch (error) {
    throw new Error(`Error generating token: ${error}`);
  }
}
