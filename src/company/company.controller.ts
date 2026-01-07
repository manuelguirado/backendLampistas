import { Controller, Delete, Req, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { generateBudgetPDF } from '../utils/generatePDF';
import {
  Body,
  Post,
  Patch,
  UseGuards,
  Request,
  Param,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CompanyGuard } from './company.guard';
import type { ContractType } from '../../generated/prisma';
import type { ItemType } from '../utils/types/itemType';
import { BudgetData } from '../utils/types/budgetData';

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

    const parsedLimit = limit ? Number(limit) : 100;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listClients(
      companyID,
      parsedLimit,
      parsedOffset,
    );
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @UseInterceptors(FileInterceptor('file'))
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
      companyName: string;
      date: string;
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      clientAddress?: string;
      file?: Express.Multer.File;
    },
    @Res() res: any,
  ) {
    try {
      const companyID = req.user.companyID;
      console.log('Creating budget for companyID:', companyID);

      // 1. Crear presupuesto en BD
      const budget = await this.companyService.createBudget(
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

      console.log('Budget saved to DB:', budget);

      // 2. Preparar datos para el PDF
      const pdfData = {
        budgetNumber: createBudgetDto.budgetNumber,
        companyName: createBudgetDto.companyName,
        budgetTitle: createBudgetDto.title,
        date: createBudgetDto.date,
        items: createBudgetDto.items,
        subtotal: createBudgetDto.subtotal,
        tax: createBudgetDto.tax,
        total: createBudgetDto.totalAmount,
        clientName: createBudgetDto.clientName || 'Cliente',
        clientAddress: createBudgetDto.clientAddress || '',
        clientPhone: createBudgetDto.clientPhone || '',
        clientEmail: createBudgetDto.clientEmail || '',
      };

      console.log('Generating PDF with data:', pdfData);

      // 3. Generar PDF
      const pdfBuffer = await generateBudgetPDF(pdfData);

      console.log('PDF generated, size:', pdfBuffer.length);

      // 4. Crear archivo PDF simulado para subir a Cloudflare
      const pdfFileName = `presupuesto_${createBudgetDto.budgetNumber}.pdf`;
      const pdfFile: Express.Multer.File = {
        fieldname: 'pdf',
        originalname: pdfFileName,
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: pdfBuffer.length,
        buffer: pdfBuffer,
        stream: undefined as any,
        destination: '',
        filename: pdfFileName,
        path: '',
      };

      // 5. Subir PDF y archivos adicionales a Cloudflare
      const filesToUpload = [pdfFile];
      if (createBudgetDto.file) {
        filesToUpload.push(createBudgetDto.file);
      }

      const uploadResult = await this.companyService.uploadFile(
        filesToUpload,
        companyID,
        'company',
        createBudgetDto.incidentID,
      );
      console.log('Files uploaded to Cloudflare:', uploadResult);

      // 6. Configurar headers y enviar PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Content-Disposition': `attachment; filename=${pdfFileName}`,
        'Cache-Control': 'no-cache',
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({
        message: 'Error creating budget',
        error: error.message,
      });
    }
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
    @Query('search') search?: string,
  ) {
    const { companyID } = req.user;

    const parsedLimit = limit ? Number(limit) : 100;
    const parsedOffset = offset ? Number(offset) : 0;
    return this.companyService.listIncidents(
      companyID,
      parsedLimit,
      parsedOffset,
      search,
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
      data: {
        startDate: string;
        endDate: string;
        shiftType: string;
        notes?: string;
      };
    },
  ) {
    const { workerID, data } = body;

    // Parsear fechas ISO string a Date objects
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    console.log('Parsed dates:', {
      startDate,
      endDate,
      shiftType: data.shiftType,
    });

    return this.companyService.assignShiftWorker(
      workerID,
      startDate,
      endDate,
      data.shiftType,
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
  @UseGuards(AuthGuard, CompanyGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Hasta 10 archivos
  @Post('uploadFile')
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    console.log('Received files:', files);
    console.log('User from token:', req.user);
    console.log('CompanyID from token:', req.user.companyID);
    const companyID = req.user.companyID;
    return this.companyService.uploadFile(files, companyID, 'company');
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Get('listFiles')
  async listFiles(@Req() req: any, @Query('incidentID') incidentID?: string) {
    const companyID = req.user.companyID;
    const incidentIDNum = incidentID ? Number(incidentID) : undefined;
    return this.companyService.listFiles(companyID, 'company', incidentIDNum);
  }
  @UseGuards(AuthGuard, CompanyGuard)
  @Post('generatePDF')
  async generatePDF(@Body() body: { budgetData: BudgetData }, @Res() res: any) {
    const pdfData = {
      budgetNumber: body.budgetData.budgetNumber,
      companyName: body.budgetData.companyName,
      budgetTitle: body.budgetData.budgetTitle,
      date: body.budgetData.date,
      items: body.budgetData.items,
      subtotal: body.budgetData.subtotal,
      tax: body.budgetData.tax,
      total: body.budgetData.total,
      clientName: body.budgetData.clientName,
      clientAddress: body.budgetData.clientAddress,
      clientPhone: body.budgetData.clientPhone,
      clientEmail: body.budgetData.clientEmail,
    };
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=budget.pdf',
      'Content-Length': (await this.companyService.generatePDF(body.budgetData))
        .length,
    });
    const pdfBuffer = await this.companyService.generatePDF(body.budgetData);
    res.send(pdfBuffer);
    //
  }
}
