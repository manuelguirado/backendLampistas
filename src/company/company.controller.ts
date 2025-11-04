import { Controller, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Body, Post, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('company/login')
  companyLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.companyService.companyLogin(email, password);
  }
  @Post('company/register')
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
    const { name, email, phone, password, admin, directions } = body;
    return this.companyService.registerCompany(
      name,
      email,
      phone,
      password,
      admin,
      directions,
    );
  }

  @Post('company/registerWorker')
  registerWorker(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      companyID: number;
    },
  ) {
    const { email, password, name, companyID } = body;
    return this.companyService.registerWorker(email, password, name, companyID);
  }
  @UseGuards(AuthGuard)
  @Patch('company/editWorker')
  editWorker(
    workerID,
    data: { email?: string; name?: string; password?: string },
  ) {
    return this.companyService.editWorker(workerID, data);
  }
  @UseGuards(AuthGuard)
  @Delete('company/deleteWorker')
  deleteWorker(workerID: number) {
    return this.companyService.eliminateWorker(workerID);
  }
  @UseGuards(AuthGuard)
  @Post('company/createBudget')
  createBudget(
    @Body()
    body: {
      incidentID: number;
      amount: number;
      description: string;
      userID: number;
      companyID: number;
      workerID: number;
      items?: string[];
    },
  ) {
    const {
      incidentID,
      amount,
      description,
      userID,
      companyID,
      workerID,
      items,
    } = body;
    return this.companyService.createBudget(
      incidentID,
      amount,
      description,
      userID,
      companyID,
      workerID,
      items,
    );
  }
  @UseGuards(AuthGuard)
  @Post('company/listWorker')
  listWorker(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.companyService.listWorker(companyID);
  }
  @UseGuards(AuthGuard)
  @Post('company/assignIncident')
  assignIncident(
    @Body()
    body: {
      incidentID: number;
      workerID: number;
    },
  ) {
    const { incidentID, workerID } = body;
    return this.companyService.assignIncident(incidentID, workerID);
  }
  @UseGuards(AuthGuard)
  @Post('company/createMachinery')
  createMachinery(
    @Body()
    body: {
      name: string;
      description: string;
      maintanceDate: Date;
      lastInspectionDate: Date;
      InstalledAT: Date;
      clientId: number;
      companyName: string;
      machineType: string;
      companyID: number;
    },
  ) {
    const {
      name,
      description,
      maintanceDate,
      lastInspectionDate,
      InstalledAT,
      clientId,
      companyName,
      machineType,
      companyID,
    } = body;
    return this.companyService.createMachinery(
      name,
      description,
      maintanceDate,
      lastInspectionDate,
      InstalledAT,
      clientId,
      companyName,
      machineType,
      companyID,
    );
  }
  @UseGuards(AuthGuard)
  @Post('company/assignShiftWorker')
  assignShiftWorker(
    @Body()
    body: {
      workerID: number;
      shiftSchedule: Date;
      shiftType: string;
    },
  ) {
    const { workerID, shiftSchedule, shiftType } = body;
    return this.companyService.assignShiftWorker(
      workerID,
      shiftSchedule,
      shiftType,
    );
  }
}
