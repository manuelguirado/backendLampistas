import { Injectable } from '@nestjs/common';
import { adminLogin } from '../modules/admin/adminLogin';
import { suspendCompany } from '../modules/admin/suspendCompany';
import { editCompany } from '../modules/admin/editCompany';

import { activateCompany } from '../modules/admin/activateCompany';
import { generateCode } from '../utils/generateCode';
import registerAdmin from '../modules/admin/registerAdmin';
import { eliminateCompany } from '../modules/admin/eliminateCompany';
@Injectable()
export class adminServices {
  async registerAdmin(email: string, password: string) {
    return registerAdmin(email, password);
  }
  async adminLogin(email: string, password: string) {
    return adminLogin(email, password);
  }
  generateCode() {
    return generateCode();
  }
  async suspendCompany(companyID: number, until?: Date) {
    return suspendCompany(companyID, until);
  }
  async editCompany(
    companyID: number,
    data: { name?: string; email?: string; password?: string },
  ) {
    return editCompany(companyID, data);
  }
  async eliminateCompany(companyID: number) {
    return eliminateCompany(companyID);
  }
  async activateCompany(companyID: number) {
    return activateCompany(companyID);
  }
}
