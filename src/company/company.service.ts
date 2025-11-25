import { Injectable } from '@nestjs/common';
import { editWorker } from '../modules/workers/editWorker';
import { registerWorker } from '../modules/workers/registerWorker';
import { eliminateWorker } from '../modules/workers/eliminateWorker';
import { createBudget } from '../modules/budgets/createbudget';
import { assignCode } from '../utils/assingCode';
import { getClientContracts } from '../modules/companies/getClientContracts';
import { companyLogin } from '../modules/companies/companyLogin';
import { listWorkers } from '../modules/companies/listWorkers';
import { assignIncident } from '../modules/incidents/assignIncident';
import { createMachinery } from '../modules/machinery/createMachinery';
import { assignShiftWorker } from '../modules/companies/assignShiftWorker';
import { validateCode } from '../utils/validateCode';
import { listClients } from '../modules/companies/listClients';
import { companyCreateUser } from '../modules/companies/createUser';
import { ContractType } from '../../generated/prisma';
import type { ItemType } from '../utils/types/itemType';
import { createContract } from '../modules/companies/updateTypeContractType';
@Injectable()
export class CompanyService {
  async companyLogin(email: string, password: string) {
    return companyLogin(email, password);
  }
  async assignCode(companyID: number, workerid?: number, userID?: number) {
    if (workerid !== undefined) {
      return assignCode('worker', undefined, workerid, undefined);
    } else if (userID !== undefined) {
      return assignCode('user', undefined, undefined, userID);
    }
  }
  async createContract(
    companyID: number,
    contractType: ContractType,
    userID: number,
  ) {
    return createContract(companyID, contractType, userID);
  }
  async validateCode(userType: 'company' | 'user' | 'worker', code: string) {
    return validateCode(userType, code);
  }

  async registerWorker(
    email: string,
    password: string,
    name: string,
    companyID: number,
  ) {
    return registerWorker(email, password, name, companyID);
  }
  async listClients(companyID: number, limit: number = 5, offset: number = 0) {
    return listClients(companyID, limit, offset);
  }
  async companyCreateUser(
    companyID: number,
    name: string,
    email: string,
    password: string,
  ) {
    return companyCreateUser(companyID, name, email, password);
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
    budgetNumber: string,
    userID: number,
    companyID: number,
    items: ItemType[],
    subtotal: number,
    tax: number,
    totalAmount: number,
    incidentID?: number,
    description?: string,
  ) {
    return createBudget(
      budgetNumber,
      userID,
      companyID,
      items,
      subtotal,
      tax,
      totalAmount,
      incidentID,
      description,
    );
  }
  async listWorkers(companyID: number, limit: number = 5, offset: number = 0) {
    return listWorkers(companyID, limit, offset);
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
  async getClientContracts(companyID: number, userID: number) {
    return getClientContracts(companyID, userID);
  }
}
