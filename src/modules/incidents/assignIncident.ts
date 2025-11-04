import { PrismaClient } from '../../../generated/prisma';
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

  return updatedIncident;
}
