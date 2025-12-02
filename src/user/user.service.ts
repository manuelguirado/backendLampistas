import { userRegister } from '../modules/users/userRegister';
import { userLogin } from '../modules/users/userLogin';
import { createIncident } from '../modules/incidents/createIncident';
import { findMyMachinery } from '../modules/machinery/findMymachinery';
import { myContracts } from '../modules/users/Mycontracts';
import { recievedBudgets } from '../modules/users/recievedBudgets';
import { Injectable } from '@nestjs/common';
import type { incidentStatus } from '../utils/types/incidentStatus';
@Injectable()
export class UserService {
  async userRegister(name: string, email: string, password: string) {
    return userRegister(name, email, password);
  }
  async userLogin(email: string, password: string) {
    return userLogin(email, password);
  }
  async createIncident(
    title: string,
    description: string,
    userID: number,
    companyID: number,
    status?: incidentStatus,
    priority?: string,
    urgency?: boolean,
  ) {
    return createIncident(
      title,
      description,
      userID,
      companyID,
      status,
      priority,
      urgency,
    );
  }
  async findMyMachinery(userID: number) {
    return findMyMachinery(userID);
  }
  async myContracts(userID: number) {
    return myContracts(userID);
  }
  async recievedBudgets(userID: number) {
    return recievedBudgets(userID);
  }
}
