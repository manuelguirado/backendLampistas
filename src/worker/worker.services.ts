import { Injectable } from '@nestjs/common';
import { workerLogin } from '../modules/workers/workerLogin';
import { listAssignedIncidents } from '../modules/workers/listAssignedIncidents';
import { updateStatusIncident } from '../modules/workers/updateStatusIncident';
import { myShifts } from '../modules/workers/myShifts';
import { validateCode } from '../utils/validateCode';
import type { UserType } from '../utils/types/userType';
import type { incidentStatus } from '../utils/types/incidentStatus';
import { uploadFile } from '../s3/uploadFile';
import { incidentHistory } from '../modules/incidents/incidentHistory';
import { getIncidentHistory } from '../modules/incidents/getIncidentHistory';
import { getIncidentPhotos } from '../modules/workers/getIncidentPhotos';
import { getDirections } from '../modules/directions/getDirections';
@Injectable()
export class WorkerService {
  async workerLogin(email: string, password: string) {
    return workerLogin(email, password);
  }
  async validateCode(userType: UserType, code: string) {
    return validateCode(userType, code);
  }

  async listAssignedIncidents(workerID: number) {
    return listAssignedIncidents(workerID);
  }

  async updateStatusIncident(
    incidentID: number,
    status: incidentStatus,
    workerID?: number,
  ) {
    return updateStatusIncident(incidentID, status, workerID);
  }
  async myShifts(workerID: number) {
    return myShifts(workerID);
  }
  async uploadFile(
    file: Array<Express.Multer.File>,
    id: number,
    userType: 'worker',
    incidentID?: number,
  ) {
    return uploadFile(file, id, userType, incidentID);
  }
  async getIncidentHistory(id: number, userType: UserType) {
    return getIncidentHistory(id, userType);
  }
  async incidentHistory(
    id: number,
    userType: UserType,
    incidentsID: number,
    changeType: string,
    oldValue?: string,
    newValue?: string,
    description?: string,
    closedAt?: Date,
  ) {
    return incidentHistory(
      id,
      userType,
      incidentsID,
      changeType,
      oldValue,
      newValue,
      description,
      closedAt,
    );
  }
  async getIncidentPhotos(incidentID: number) {
    return getIncidentPhotos(incidentID);
  }
  async getDirections(workerID: number, incidentID?: number) {
    return getDirections(workerID, incidentID);
  }
}
