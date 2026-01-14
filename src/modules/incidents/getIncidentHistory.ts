import { PrismaClient } from '../../../generated/prisma';
import { sign, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserID } from '../../utils/getUserID';
import type { UserType } from '../../utils/types/userType';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function getIncidentHistory(id: number, userType: UserType) {
  try {
    const getID = await getUserID(userType, id);

    if (!getID) {
      throw new Error('User not found');
    }

    // Buscar historial por userID, no por id genérico
    const history = await prisma.incidentHistory.findMany({
      where: {
        userID: userType === 'user' ? id : undefined,
        workerID: userType === 'worker' ? id : undefined,
        companyID: userType === 'company' ? id : undefined,
      },
      include: {
        incident: {
          select: {
            IncidentsID: true,
            title: true,
            description: true,
            status: true,
            dateReported: true,
          },
        },
        worker: { select: { name: true } },
        company: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { changedAt: 'desc' },
    });

    const mappedIncidentHistory = history.map((entry) => ({
      id: entry.incident.IncidentsID,
      title: entry.incident.title,
      description: entry.incident.description,
      status: entry.incident.status,
      createdAt: entry.incident.dateReported,
      closedAt: entry.closedAt,
      changeLog: entry.changeLog,
      changedAt: entry.changedAt,
      userName: entry.user ? entry.user.name : null,
      workerName: entry.worker ? entry.worker.name : null,
      workerid: entry.workerID,
      companyName: entry.company ? entry.company.name : null,
    }));

    // Crear un payload válido para JWT
    const payload = {
      userID: userType === 'user' ? id : undefined,
      workerID: userType === 'worker' ? id : undefined,
      companyID: userType === 'company' ? id : undefined,
      role: userType,
      mappedIncidentHistory,
    };

    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = sign(payload, secret, options);

    return { token, ...mappedIncidentHistory };
  } catch (error) {
    throw new Error(`Error getting incident history: ${error}`);
  }
}
