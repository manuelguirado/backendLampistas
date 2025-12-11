import { userRegister } from '../modules/users/userRegister';
import { userLogin } from '../modules/users/userLogin';
import { createIncident } from '../modules/incidents/createIncident';
import { findMyMachinery } from '../modules/machinery/findMymachinery';
import { myContracts } from '../modules/users/Mycontracts';
import { myIncidents } from '../modules/users/myIncidents';
import { recievedBudgets } from '../modules/users/recievedBudgets';
import { validateCode } from '../utils/validateCode';
import { Injectable } from '@nestjs/common';

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
    location: string,
    userID: number,
    companyID: number,
    priority?: string,
    urgency?: boolean,
  ) {
    return createIncident(
      title,
      description,
      location,
      userID,
      companyID,
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
  async validateCode(userType: 'user', code: string) {
    return validateCode(userType, code);
  }
  async myIncidents(userID: number) {
    return myIncidents(userID);
  }
}
