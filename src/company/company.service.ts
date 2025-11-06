import { Injectable } from '@nestjs/common';
import { editWorker } from '../modules/workers/editWorker';
import { registerWorker } from '../modules/workers/registerWorker';
import { eliminateWorker } from '../modules/workers/eliminateWorker';
import { createBudget } from '../modules/budgets/createbudget';
import { registerCompany } from '../modules/companies/registerCompany';
import { companyLogin } from '../modules/companies/companyLogin';
import { listWorker } from '../modules/workers/listWorker';
import { assignIncident } from '../modules/incidents/assignIncident';
import { createMachinery } from '../modules/machinery/createMachinery';
import { assignShiftWorker } from '../modules/companies/assignShiftWorker';
@Injectable()
export class CompanyService {
  async companyLogin(email: string, password: string) {
    return companyLogin(email, password);
  }

  async registerCompany(
    name: string,
    phone: string,
    email: string,
    password: string,
    admin: number,
    directions: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    },
  ) {
    return registerCompany(name, phone, email, password, admin, directions);
  }
  async registerWorker(
    email: string,
    password: string,
    name: string,
    companyID: number,
  ) {
    return registerWorker(email, password, name, companyID);
  }

  async editWorker(
    workerID: number,
    data: { email?: string; name?: string; password?: string },
  ) {
    return editWorker(workerID, data);
  }

  async eliminateWorker(workerID: number) {
    return eliminateWorker(workerID);
  }
  async createBudget(
    incidentID: number,
    amount: number,
    description: string,
    userID: number,
    companyID: number,
    workerID: number,
    items?: string[],
  ) {
    return createBudget(
      incidentID,
      amount,
      description,
      userID,
      companyID,
      workerID,
      items,
    );
  }
  async listWorker(companyID: number) {
    return listWorker(companyID);
  }
  async assignIncident(incidentID: number, workerID: number) {
    return assignIncident(incidentID, workerID);
  }
  createMachinery(
    name: string,
    description: string,
    maintanceDate: Date,
    lastInspectionDate: Date,
    InstalledAT: Date,
    clientId: number,
    companyName: string,
    machineType: string,
    companyID: number,
    serialNumber: string,
  ) {
    return createMachinery(
      name,
      description,
      maintanceDate,
      lastInspectionDate,
      InstalledAT,
      clientId,
      companyName,
      machineType,
      companyID,
      serialNumber,
    );
  }
  async assignShiftWorker(
    workerID: number,
    shiftSchedule: Date,
    shiftType: string,
  ) {
    return assignShiftWorker(workerID, shiftSchedule, shiftType);
  }
}
