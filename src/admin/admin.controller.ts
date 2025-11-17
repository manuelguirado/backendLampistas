import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';

import { adminServices } from './admin.services';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: adminServices) {}
  @Post('adminLogin')
  adminLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.adminService.adminLogin(email, password);
  }

  @Post('adminRegister')
  registerAdmin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.adminService.registerAdmin(email, password);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('consultStatus/:companyID')
  consultStatus(@Param('companyID') companyID: string) {
    const parseCompanyID = Number(companyID);
    return this.adminService.consultStatus(parseCompanyID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('assignCode/:companyID')
  assingCode(@Param('companyID') companyID: string) {
    const parseString = Number(companyID);
    return this.adminService.assignCode(parseString);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('suspendCompany/:companyID')
  suspendCompany(
    @Param('companyID') companyID: string,
    @Body() body: { until?: Date },
  ) {
    const parseCompanyID = Number(companyID);
    const { until } = body;
    return this.adminService.suspendCompany(parseCompanyID, until);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('eliminateCompany/:companyID')
  eliminateCompany(@Param('companyID') companyID: string) {
    const parseCompanyID = Number(companyID);
    return this.adminService.eliminateCompany(parseCompanyID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('activateCompany/:companyID')
  activateCompany(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.adminService.activateCompany(companyID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('editCompany/:companyID')
  editCompany(
    @Param('companyID') companyID: string,
    @Body()
    body: {
      data: { name?: string; phone?: string; email?: string };
      adminID: number;
    },
  ) {
    const { data, adminID } = body;
    const parseCompanyID = Number(companyID);
    return this.adminService.editCompany(parseCompanyID, data, adminID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('listCompany')
  listCompany(@Request() req: any) {
    const adminID = req.user.adminID;
    return this.adminService.listCompany(adminID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('registerCompany')
  registerCompany(
    @Body()
    body: {
      name: string;
      phone: string;
      email: string;
      password: string;
      admin: number;
      directions: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
      };
    },
  ) {
    const { name, phone, email, password, admin, directions } = body;
    return this.adminService.registerCompany(
      name,
      phone,
      email,
      password,
      admin,
      directions,
    );
  }
}
