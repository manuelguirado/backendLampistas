import { Controller, Delete, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  Body,
  Post,
  Patch,
  UseGuards,
  Request,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CompanyGuard } from './company.guard';
import type { ContractType } from '../../generated/prisma';
import type { ItemType } from '../utils/types/itemType';
import { MachineryType } from '../utils/types/machineType';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('CompanyLogin')
  companyLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.companyService.companyLogin(email, password);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('assignWorkerCode/:workerID')
  assignCode(@Request() req: any, @Param('workerID') workerID: string) {
    const { companyID } = req.user;
    return this.companyService.assignCode(
      companyID,
      Number(workerID),
      undefined,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('assignUserCode/:userID')
  asignCode(@Request() req: any, @Param('userID') userID: string) {
    const { companyID } = req.user;
    return this.companyService.assignCode(companyID, undefined, Number(userID));
  }

  @UseGuards(AuthGuard, CompanyGuard)
  @Post('RegisterWorker')
  registerWorker(
    @Request() req: any,
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
    },
  ) {
    const { email, password, name } = body;
    const companyID = req.user.companyID;
    return this.companyService.registerWorker(email, password, name, companyID);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('createContract')
  createContract(
    @Request() req: any,
    @Body()
    body: {
      contractType: ContractType;
      userID: number;
    },
  ) {
    const { contractType, userID } = body;
    const companyID = req.user.companyID;
    return this.companyService.createContract(companyID, contractType, userID);
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
  @Patch('editWorker/:workerID')
  editWorker(
    @Param('workerID') workerID: string,
    @Body()
    body: {
      data: { email?: string; name?: string; password?: string };
    },
  ) {
    const workerIDNumber = Number(workerID);
    const { data } = body;
    return this.companyService.editWorker(workerIDNumber, data);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('companyCreateUser')
  companyCreateUser(
    @Request() req: any,
    @Body()
    createUserDto: { name: string; email: string; password: string },
  ) {
    const companyID = req.user.companyID;
    return this.companyService.companyCreateUser(
      companyID,
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Delete('deleteWorker/:workerID')
  deleteWorker(@Param('workerID') workerID: string) {
    return this.companyService.eliminateWorker(Number(workerID));
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('listClients')
  listClients(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const { companyID } = req.user;

    const parsedLimit = limit ? Number(limit) : 5;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listClients(
      companyID,
      parsedLimit,
      parsedOffset,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('CreateBudget')
  async createBudget(
    @Request() req,
    @Body()
    createBudgetDto: {
      budgetNumber: string;
      userID: number;
      companyID: number;
      title: string;
      items: ItemType[];
      subtotal: number;
      tax: number;
      totalAmount: number;
      incidentID?: number;
      description?: string;
    },
  ) {
    const companyID = req.user.companyID;

    return this.companyService.createBudget(
      createBudgetDto.budgetNumber,
      createBudgetDto.userID,
      companyID,
      createBudgetDto.title,
      createBudgetDto.items,
      createBudgetDto.subtotal,
      createBudgetDto.tax,
      createBudgetDto.totalAmount,
      createBudgetDto.incidentID,
      createBudgetDto.description ?? '',
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('listWorkers')
  listWorkers(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const { companyID } = req.user;

    const parsedLimit = limit ? Number(limit) : 5;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listWorkers(
      companyID,
      parsedLimit,
      parsedOffset,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('listIncidents')
  listIncidents(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const { companyID } = req.user;

    const parsedLimit = limit ? Number(limit) : 5;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listIncidents(
      companyID,
      parsedLimit,
      parsedOffset,
    );
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
    @Request() req: any,
    @Body()
    body: {
      name: string;
      description?: string;
      machineType: string;
      brand?: string;
      installedAt?: Date;
      model: string;
      serialNumber: string;
      companyName?: string;
      clientID?: number; // ✅ Agregar clientID al body
    },
  ) {
    const companyID = req.user.companyID;

    return this.companyService.createMachinery(
      {
        name: body.name,
        description: body.description || '',
        machineType: body.machineType,
        model: body.model,
        installedAT: body.installedAt || new Date(),
        serialNumber: body.serialNumber,
        companyName: body.companyName || '',
        companyID,

        brand: body.brand || 'UNKNOWN',
        clientID: body.clientID || 0, // ✅ Manejar clientID opcional
      },
      req.user.userID,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('assignShiftWorker')
  assignShiftWorker(
    @Body()
    body: {
      workerID: number;
      startDate: string;
      endDate: string;
      shiftType: string;
    },
  ) {
    const { workerID, startDate, endDate, shiftType } = body;

    return this.companyService.assignShiftWorker(
      workerID,
      new Date(startDate),
      new Date(endDate),
      shiftType,
    );
  }
  @Post('createUser')
  @UseGuards(AuthGuard, CompanyGuard)
  createUser(
    @Request() req,
    @Body() createUserDto: { name: string; email: string; password: string },
  ) {
    const companyID = req.user.companyID; // Del JWT

    return this.companyService.companyCreateUser(
      companyID,
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('getClientContracts/:userID')
  getClientContracts(@Request() req: any, @Param('userID') userID: string) {
    const { companyID } = req.user;
    return this.companyService.getClientContracts(companyID, Number(userID));
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('listMachinery')
  listMachinery(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const { companyID } = req.user;

    const parsedLimit = limit ? Number(limit) : 5;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listMachinery(
      companyID,
      parsedLimit,
      parsedOffset,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Patch('editMachinery/:machineryID')
  editMachinery(
    @Req() req: any,
    @Param('machineryID') machineryID: string,

    @Body()
    body: {
      name?: string;
      description?: string;
      machineType?: string;
      brand?: string;
      model?: string;
      serialNumber?: string;
    },
  ) {
    const machineryIDNumber = req.user.machineryID;
    const companyID = req.user.companyID;
    const { name, description, machineType, brand, model, serialNumber } = body;
    return this.companyService.editMachinery(machineryIDNumber, companyID, {
      name,
      description,
      machineType,
      brand,
      model,
      serialNumber,
    });
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Patch('updateMaintenceDate/:machineryID')
  updateMaintenceDate(
    @Param('machineryID') machineryID: number,
    @Body()
    body: {
      lastInspectionDate: string;
    },
  ) {
    const { lastInspectionDate } = body;

    const parseMachineryID = Number(machineryID);
    return this.companyService.updateMaintenceDate(
      parseMachineryID,
      new Date(lastInspectionDate),
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Delete('eliminateMachinery/:machineryID')
  eliminateMachinery(@Param('machineryID') machineryID: string) {
    const parseMachineryID = Number(machineryID);
    return this.companyService.eliminateMachinery(parseMachineryID);
  }
}
