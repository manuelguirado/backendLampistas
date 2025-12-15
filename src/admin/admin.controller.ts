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
  Query,
} from '@nestjs/common';

import { adminServices } from './admin.services';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: adminServices) {}
  @Post('adminLogin')
  async adminLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      return await this.adminService.adminLogin(email, password);
    } catch (error) {
      // ✅ Devolver el mensaje de error específico
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión',
      };
    }
  }

  @Post('adminRegister')
  async registerAdmin(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      return await this.adminService.registerAdmin(email, password);
    } catch (error) {
      // ✅ Devolver el mensaje de error específico
      return {
        success: false,
        message: error.message || 'Error al registrar administrador',
      };
    }
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
  listCompany(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const adminID = req.user.adminID;
    const parsedLimit = limit ? Number(limit) : 5;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.adminService.listCompany(adminID, parsedLimit, parsedOffset);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('registerCompany')
  registerCompany(
    @Request() req: any,
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
    const admin = req.user.adminID;
    const { name, phone, email, password, directions } = body;
    try {
      return this.adminService.registerCompany(
        name,
        phone,
        email,
        password,
        admin,
        directions,
      );
    } catch (error) {
      // ✅ Devolver el mensaje de error específico
      return {
        success: false,
        message: error.message || 'Error al registrar la empresa',
      };
    }
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('refreshToken')
  refreshToken(@Request() req: any, @Body() body: { token: string }) {
    const adminID = req.user.adminID;
    const { token } = body;
    return this.adminService.refreshToken(token, adminID);
  }
}
