import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function updateStatusIncident(incidentID: number, status: string) {
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
  return updatedIncident;
}
