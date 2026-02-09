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
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';

import { adminServices } from './admin.services';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserType } from '../utils/types/userType';
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
  @Patch('suspendCompany')
  suspendCompany(@Body() body: { companyEmail: string; until?: Date }) {
    const { companyEmail, until } = body;
    return this.adminService.suspendCompany(companyEmail, until);
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
  @UseInterceptors(FileInterceptor('logo'))
  @Post('registerCompany')
  async registerCompany(
    @Request() req: any,
    @UploadedFile() logo: Express.Multer.File,
    @Body()
    body: {
      name: string;
      phone: string;
      email: string;
      password: string;
      admin: number;
      directions:
        | string
        | {
            address: string;
            city: string;
            state: string;
            zipCode: string;
          };
    },
  ) {
    const adminID = req.user.adminID;
    const { name, phone, email, password } = body;

    // Parsear directions si viene como string (desde FormData)
    const directions =
      typeof body.directions === 'string'
        ? JSON.parse(body.directions)
        : body.directions;

    try {
      // Registrar la compañía primero
      const company = await this.adminService.registerCompany(
        name,
        phone,
        email,
        password,
        adminID,
        directions,
      );

      // Si hay logo, subirlo asociado a la compañía
      if (logo && company?.companyID) {
        await this.adminService.uploadFile(
          [logo],
          company.companyID,
          'company',
        );
      }

      return company;
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
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadFile')
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Query('incidentID') incidentID?: string,
  ) {
    const id = req.user.adminID;
    const userType: UserType = 'admin';

    return this.adminService.uploadFile([file], id, userType);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('activeClients')
  async activeClients(@Request() req: any) {
    const adminID = req.user.adminID;

    return this.adminService.activeClients(adminID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('activeCompanies')
  async activeCompanies(@Request() req: any) {
    const adminID = req.user.adminID;
    return this.adminService.activeCompanies(adminID);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Get('activeIncidents')
  async activeIncidents(@Request() req: any) {
    const adminID = req.user.adminID;
    return this.adminService.activeIncidents(adminID);
  }
}
