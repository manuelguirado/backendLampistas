import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { incidentStatus } from '../../utils/types/incidentStatus';
import { incidentHistory } from '../incidents/incidentHistory';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function updateStatusIncident(
  incidentID: number,
  status: incidentStatus,
  workerID?: number, // Añadir workerID como parámetro opcional
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

  // Obtener el estado anterior para el log
  const oldStatus = incident.status;
  // Actualizar el estado y la fecha de cierre si es necesario
  const updateData: {
    status: incidentStatus;
    closureDate?: Date | null;
  } = {
    status: status,
    closureDate: status === 'closed' ? new Date() : null,
  };
  if (status === 'closed') {
    updateData.closureDate = new Date();
  }

  const updatedIncident = await prisma.incidents.update({
    where: { IncidentsID: incidentID },
    data: updateData,
  });

  // Registrar en el historial la acción del trabajador
  try {
    const effectiveWorkerID = workerID || incident.assignedWorkerID;
    if (effectiveWorkerID) {
      const changeDescription =
        status === 'closed'
          ? 'Incidencia cerrada por el trabajador'
          : `Estado actualizado de "${oldStatus}" a "${status}" por el trabajador`;

      await incidentHistory(
        effectiveWorkerID,
        'worker',
        incidentID,
        'Status Update',
        oldStatus || undefined,
        status,
        changeDescription,
        status === 'closed' ? new Date() : undefined,
      );
    }
  } catch (historyError) {
    console.error('Error creating incident history:', historyError);
  }

  try {
    const payload = {
      incidentID: updatedIncident.IncidentsID,
      status: updatedIncident.status,
      workerID: workerID || incident.assignedWorkerID,
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
