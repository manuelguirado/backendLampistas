import { Injectable } from '@nestjs/common';
import { workerLogin } from '../modules/workers/workerLogin';
import { listAssignedIncidents } from '../modules/workers/listAssignedIncidents';
import { updateStatusIncident } from '../modules/workers/updateStatusIncident';
import { myShifts } from '../modules/workers/myShifts';
import { validateCode } from '../utils/validateCode';
import type { UserType } from '../utils/types/userType';
import type { incidentStatus } from '../utils/types/incidentStatus';
import { uploadFile } from '../s3/uploadFile';

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

  async updateStatusIncident(incidentID: number, status: incidentStatus) {
    return updateStatusIncident(incidentID, status);
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
}
