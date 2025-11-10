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
} from '@nestjs/common';

import { adminServices } from './admin.services';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: adminServices) {}
  @UseGuards(AdminGuard)
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
  @UseGuards(AuthGuard)
  @Get('generateCode')
  generateCode() {
    return this.adminService.generateCode();
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
    },
  ) {
    const { companyID, data } = body;
    return this.adminService.editCompany(companyID, data);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('listCompany')
  listCompany(@Query() body: { adminID: string }) {
    const { adminID } = body;
    const adminIDnumber = parseInt(adminID, 10);

    return this.adminService.listCompany(adminIDnumber);
  }
}
