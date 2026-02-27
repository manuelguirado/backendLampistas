import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

export async function filterIncidents(incidentID: number) {
  if (!incidentID) {
    throw new Error('incidentID is required');
  }
  const incident = await prisma.incidents.findMany({
    where: {
      IncidentsID: incidentID,
      status: { not: 'closed' as const },
    },
    include: {
      assignedWorker: {
        select: {
          workerid: true,
          name: true,
        },
      },
    },
  });
  return incident;
}
