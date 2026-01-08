import { userRegister } from '../modules/users/userRegister';
import { userLogin } from '../modules/users/userLogin';
import { createIncident } from '../modules/incidents/createIncident';
import { findMyMachinery } from '../modules/machinery/findMymachinery';
import { myContracts } from '../modules/users/Mycontracts';
import { myIncidents } from '../modules/users/myIncidents';
import { recievedBudgets } from '../modules/users/recievedBudgets';
import { validateCode } from '../utils/validateCode';
import { Injectable } from '@nestjs/common';
import { uploadFile } from '../s3/uploadFile';
import { listFiles } from '../s3/listFiles';
import { downloadFile } from '../s3/downloadFile';

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
    files?: Express.Multer.File[], // Añadir parámetro de archivos
  ) {
    return createIncident(
      title,
      description,
      location,
      userID,
      companyID,
      priority,
      urgency,
      files, // Pasar archivos
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
  async myIncidents(userID: number, limit?: number, offset?: number) {
    return myIncidents(userID, limit, offset);
  }
  async uploadFile(
    file: Array<Express.Multer.File>,
    id: number,
    userType: 'user',
    incidentID?: number,
  ) {
    return uploadFile(file, id, userType, incidentID);
  }
  async listFiles(id: number, userType: 'user', incidentID?: number) {
    return listFiles(id, userType, incidentID);
  }
  async downloadFile(id: number, userType: 'user', budgetID: number) {
    return downloadFile(id, userType, budgetID);
  }
}
