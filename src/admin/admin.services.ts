import { Injectable } from '@nestjs/common';
import { adminLogin } from '../modules/admin/adminLogin';
import { suspendCompany } from '../modules/admin/suspendCompany';
import { editCompany } from '../modules/admin/editCompany';
import { listCompany } from '../modules/admin/listCompany';
import { refreshToken } from '../utils/refreshToken';
import { activateCompany } from '../modules/admin/activateCompany';
import { assignCode } from '../utils/assingCode';
import { consultStatus } from '../modules/admin/consultStatus';
import registerAdmin from '../modules/admin/registerAdmin';

import { eliminateCompany } from '../modules/admin/eliminateCompany';
import { registerCompany } from '../modules/companies/registerCompany';
import { uploadFile } from '../s3/uploadFile';
import { UserType } from '../utils/types/userType';
@Injectable()
export class adminServices {
  async registerAdmin(email: string, password: string) {
    return registerAdmin(email, password);
  }
  async adminLogin(email: string, password: string) {
    return adminLogin(email, password);
  }
  async consultStatus(companyID: number) {
    return consultStatus(companyID);
  }
  assignCode(companyID: number) {
    return assignCode('company', companyID);
  }
  async suspendCompany(companyEmail: string, until?: Date) {
    return suspendCompany(companyEmail, until);
  }
  async editCompany(
    companyID: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      address?: string;
      phone?: string;
      zipCode?: string;
      city?: string;
      state?: string;
    },
    adminID: number,
  ) {
    return editCompany(companyID, data, adminID);
  }
  async eliminateCompany(companyID: number) {
    return eliminateCompany(companyID);
  }
  async activateCompany(companyID: number) {
    return activateCompany(companyID);
  }
  async listCompany(adminID: number, limit: number = 5, offset: number = 0) {
    return listCompany(adminID, limit, offset);
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
  async refreshToken(token: string, adminID: number) {
    return refreshToken(token, 'admin', adminID);
  }
  async uploadFile(
    file: Array<Express.Multer.File>,
    adminID: number,
    userType: UserType,
  ) {
    return uploadFile(file, adminID, userType);
  }
}
