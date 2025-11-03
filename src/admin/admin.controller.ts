import { Controller } from '@nestjs/common';
import { Body, Post, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import { adminServices } from './admin.services';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: adminServices) {}

  @Post('admin/login')
  adminLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.adminService.adminLogin(email, password);
  }

  @Post('admin/register')
  registerAdmin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.adminService.registerAdmin(email, password);
  }
  @Get('admin/generateCode')
  generateCode() {
    return this.adminService.generateCode();
  }
  @UseGuards(AuthGuard)
  @Patch('admin/suspendCompany')
  suspendCompany(@Body() body: { companyID: number; until?: Date }) {
    const { companyID, until } = body;
    return this.adminService.suspendCompany(companyID, until);
  }
  @UseGuards(AuthGuard)
  @Post('admin/eliminateCompany')
  eliminateCompany(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.adminService.eliminateCompany(companyID);
  }
  @UseGuards(AuthGuard)
  @Patch('admin/activateCompany')
  activateCompany(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.adminService.activateCompany(companyID);
  }
  @UseGuards(AuthGuard)
  @Post('admin/editCompany')
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
}
