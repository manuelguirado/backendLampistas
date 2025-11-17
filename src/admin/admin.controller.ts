import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  UseGuards,
  Query,
  Request,
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
  @Get('assignCode')
  assingCode(@Query('companyID') companyID: number) {
    const parseString = Number(companyID);
    return this.adminService.assignCode(parseString);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('suspendCompany')
  suspendCompany(@Body() body: { companyID: number; until?: Date }) {
    const { companyID, until } = body;
    return this.adminService.suspendCompany(companyID, until);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('eliminateCompany')
  eliminateCompany(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.adminService.eliminateCompany(companyID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('activateCompany')
  activateCompany(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.adminService.activateCompany(companyID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('editCompany')
  editCompany(
    @Body()
    body: {
      companyID: number;
      data: { name?: string; email?: string; password?: string };
      adminID: number;
    },
  ) {
    const { companyID, data, adminID } = body;
    return this.adminService.editCompany(companyID, data, adminID);
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
