import { Controller, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Body, Post, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CompanyGuard } from './company.guard';
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('CompanyLogin')
  companyLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.companyService.companyLogin(email, password);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('assignCode')
  assignCode(
    @Body()
    body: {
      companyID?: number;
      workerid?: number;
      userID?: number;
    },
  ) {
    const { companyID, workerid, userID } = body;
    return this.companyService.assignCode(companyID!, workerid, userID);
  }

  @UseGuards(AuthGuard, CompanyGuard)
  @Post('RegisterWorker')
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

  @Post('validateCode')
  validateCode(
    @Body()
    body: {
      userType: 'company';
      code: string;
    },
  ) {
    const { userType, code } = body;
    return this.companyService.validateCode(userType, code);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Patch('editWorker')
  editWorker(
    @Body()
    body: {
      workerID: number;
      data: { email?: string; name?: string; password?: string };
    },
  ) {
    const { workerID, data } = body;
    return this.companyService.editWorker(workerID, data);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Delete('deleteWorker')
  deleteWorker(@Body() body: { workerID: number }) {
    return this.companyService.eliminateWorker(body.workerID);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('CreateBudget')
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
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('listWorkers')
  listWorkers(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.companyService.listWorkers(companyID);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('assignIncident')
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
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('createMachinery')
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
      serialNumber: string;
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
      serialNumber,
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
      serialNumber,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('assignShiftWorker')
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
