import { Injectable } from '@nestjs/common';
import { editWorker } from '../modules/workers/editWorker';
import { registerWorker } from '../modules/workers/registerWorker';
import { eliminateWorker } from '../modules/workers/eliminateWorker';
import { createBudget } from '../modules/budgets/createbudget';
import { registerCompany } from '../modules/companies/registerCompany';
import { companyLogin } from '../modules/companies/companyLogin';

@Injectable()
export class CompanyService {
  async companyLogin(email: string, password: string) {
    return companyLogin(email, password);
  }

  async registerCompany(
    name: string,
    email: string,
    phone: string,
    password: string,
    directions: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    },
  ) {
    return registerCompany(name, phone, email, password, directions);
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
}
