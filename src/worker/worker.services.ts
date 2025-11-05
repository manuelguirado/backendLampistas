import { Injectable } from '@nestjs/common';
import { workerLogin } from '../modules/workers/workerLogin';
import { listAssignedIncidents } from '../modules/workers/listAssignedIncidents';
import { updateStatusIncident } from '../modules/workers/updateStatusIncident';
import { myShifts } from '../modules/workers/myShifts';

@Injectable()
export class WorkerService {
  async workerLogin(email: string, password: string) {
    return workerLogin(email, password);
  }

  async listAssignedIncidents(workerID: number) {
    return listAssignedIncidents(workerID);
  }

  async updateStatusIncident(incidentID: number, status: string) {
    return updateStatusIncident(incidentID, status);
  }
  async myShifts(workerID: number) {
    return myShifts(workerID);
  }
}
