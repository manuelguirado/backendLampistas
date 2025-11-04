import { userRegister } from '../modules/users/userRegister';
import { userLogin } from '../auth/user/userLogin';
import { createIncident } from '../modules/incidents/createIncident';
import { findMyMachinery } from '../modules/machinery/findMymachinery';
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
    machineryID: number,
    userID: number,
  ) {
    return createIncident(title, description, machineryID, userID);
  }
  async findMyMachinery(userID: number) {
    return findMyMachinery(userID);
  }
}
