import { Worker } from './../../../generated/prisma/index.d';
import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();

export async function listAssignedIncidents(workerid: number) {
  if (!workerid) {
    throw new Error('Worker ID is required');
  }
  const company = await prisma.company.findFirst({
    where: { workers: { some: { workerid: workerid } } },
  });

  if (!company) {
    throw new Error('Worker does not belong to any company');
  }

  const worker = await prisma.worker.findUnique({
    where: { workerid: workerid },
  });

  if (!worker) {
    throw new Error('Worker not found');
  }

  const incidents = await prisma.incidents.findMany({
    where: { assignedWorkerID: workerid },
  });
  if (!incidents || incidents.length === 0) {
    return [];
  }
  const mappedIncidents = incidents.map((incident) => ({
    incidentID: incident.IncidentsID,
    title: incident.title,
    description: incident.description,
    dateReported: incident.createdAt,
    status: incident.status,
    companyID: incident.companyID,
    reportedByUserID: incident.userID,
    assignedWorkerID: incident.assignedWorkerID,
  }));

  return mappedIncidents;
}
