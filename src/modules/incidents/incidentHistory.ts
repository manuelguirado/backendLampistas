import { PrismaClient } from '../../../generated/prisma';
import { sign, SignOptions } from 'jsonwebtoken';
import type { UserType } from '../../utils/types/userType';
import { getUserID } from '../../utils/getUserID';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

export async function incidentHistory(
  id: number,
  userType: UserType,
  incidentsID: number,
  changeType: string,
  oldValue?: string,
  newValue?: string,
  description?: string,
  closedAt?: Date,
) {
  try {
    const getID = await getUserID(userType, id);
    if (!getID) {
      throw new Error('User not found');
    }

    const incident = await prisma.incidents.findFirst({
      where: { IncidentsID: incidentsID },
    });

    if (!incident) {
      throw new Error('Incident not found');
    }

    // Crear entrada de historial descriptiva

    const changeLog =
      description ||
      `${changeType}: ${oldValue ? `${oldValue} → ${newValue}` : newValue || 'Created'}`;

    // Para trabajadores, usar el ID del trabajador que está haciendo la acción
    const effectiveWorkerID =
      userType === 'worker' && 'workerid' in getID
        ? getID.workerid
        : incident.assignedWorkerID;

    const incidentHistory = await prisma.incidentHistory.create({
      data: {
        incidentID: incident.IncidentsID,
        companyID: 'companyID' in getID ? getID.companyID : null,
        userID: incident.userID,
        workerID: effectiveWorkerID,
        changeLog,
        closedAt: closedAt,
      },
    });

    const payload = {
      incidentID: incident.IncidentsID,
      companyID: 'companyID' in getID ? getID.companyID : null,
      userID: incident.userID,
      workerID: effectiveWorkerID || null,
      role: getID.role,
    };

    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = sign(payload, secret, options);

    return { token, ...incidentHistory };
  } catch (error) {
    throw new Error(`Error creating incident history: ${error}`);
  }
}
