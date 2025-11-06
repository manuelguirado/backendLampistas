import { Controller, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Body, Post, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('CompanyLogin')
  companyLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.companyService.companyLogin(email, password);
  }
  @Post('CompanyRegister')
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Delete('deleteWorker')
  deleteWorker(@Body() body: { workerID: number }) {
    return this.companyService.eliminateWorker(body.workerID);
  }
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Post('listWorker')
  listWorker(@Body() body: { companyID: number }) {
    const { companyID } = body;
    return this.companyService.listWorker(companyID);
  }
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
