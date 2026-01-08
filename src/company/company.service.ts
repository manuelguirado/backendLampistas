import { Injectable } from '@nestjs/common';
import { editWorker } from '../modules/workers/editWorker';
import { MachineryType } from '../utils/types/machineType';
import { registerWorker } from '../modules/workers/registerWorker';
import { listIncidents } from '../modules/companies/listIncidents';
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
import { listMachinery } from '../modules/machinery/listMachinery';
import { editMachinery } from '../modules/machinery/editMachinery';
import { updateMaintenceDate } from '../modules/machinery/updateMaintenceDate';
import { eliminateMachinery } from '../modules/machinery/eliminateMachinery';
import { uploadFile } from '../s3/uploadFile';
import { listFiles } from '../s3/listFiles';
import { generatePDF } from '../utils/generatePDF';
import { BudgetData } from '../utils/types/budgetData';
@Injectable()
export class CompanyService {
  async companyLogin(email: string, password: string) {
    return companyLogin(email, password);
  }
  async assignCode(companyID: number, workerid?: number, userID?: number) {
    if (workerid !== undefined) {
      return assignCode('worker', workerid);
    } else if (userID !== undefined) {
      return assignCode('user', userID);
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
  async listIncidents(
    companyID: number,
    limit: number = 5,
    offset: number = 0,
    search?: string,
  ) {
    return listIncidents(companyID, search, limit, offset);
  }
  async createBudget(
    budgetNumber: string,
    userID: number,
    companyID: number,
    title: string,
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
      title,
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
  createMachinery(machineryType: MachineryType, userID: number) {
    return createMachinery(machineryType, userID);
  }
  async assignShiftWorker(
    workerID: number,
    startDate: Date,
    endDate: Date,
    shiftType: string,
  ) {
    return assignShiftWorker(workerID, startDate, endDate, shiftType);
  }
  async getClientContracts(companyID: number, userID: number) {
    return getClientContracts(companyID, userID);
  }
  async listMachinery(
    companyID: number,
    limit: number = 5,
    offset: number = 0,
  ) {
    return listMachinery(companyID, limit, offset);
  }
  async editMachinery(
    machineryID: number,
    companyID: number,
    data: {
      name?: string;
      model?: string;
      serialNumber?: string;
      machineType?: string;
      brand?: string;
      description?: string;
      installedAt?: Date;
      companyName?: string;
    },
  ) {
    return editMachinery(machineryID, companyID, data);
  }
  async updateMaintenceDate(machineryID: number, newMaintenceDate: Date) {
    return updateMaintenceDate(machineryID, newMaintenceDate);
  }
  async eliminateMachinery(machineryID: number) {
    return eliminateMachinery(machineryID);
  }
  async uploadFile(
    file: Array<Express.Multer.File>,
    id: number,
    userType: 'company',
    incidentID?: number,
    budgetID?: number,
  ) {
    return uploadFile(file, id, userType, incidentID, budgetID);
  }
  async listFiles(id: number, userType: 'company', incidentID?: number) {
    return listFiles(id, userType, incidentID);
  }
  async generatePDF(budgetData: BudgetData): Promise<Buffer> {
    return generatePDF(budgetData);
  }
}
