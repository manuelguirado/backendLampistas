import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  BadRequestException,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { WorkerService } from './worker.services';
import type { incidentStatus } from '../utils/types/incidentStatus';
import { WorkerGuard } from './worker.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UserType } from '../utils/types/userType';
@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
  @Post('workerLogin')
  async workerLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.workerService.workerLogin(email, password);
  }

  @UseGuards(AuthGuard, WorkerGuard)
  @Get('assignedIncidents')
  async listAssignedIncidents(@Req() req) {
    const workerID = req.user?.workerID; // ✅ Cambiar a workerID mayúscula

    if (!workerID) {
      throw new BadRequestException('Worker ID not found in token');
    }

    return this.workerService.listAssignedIncidents(workerID);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Patch('updateIncidentStatus')
  async updateIncidentStatus(
    @Req() req,
    @Body() body: { incidentID: number; status: incidentStatus },
  ) {
    const { incidentID, status } = body;
    const workerID = req.user?.workerID; // Obtener el workerID del token
    return this.workerService.updateStatusIncident(
      incidentID,
      status,
      workerID,
    );
  }

  @Post('validateCode')
  async validateCode(
    @Req() req,
    @Body() body: { userType: 'worker'; code: string },
  ) {
    const { userType, code } = body;

    return this.workerService.validateCode(userType, code);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Get('myShifts')
  async myShifts(@Req() req) {
    const workerID = req.user.workerID;

    return this.workerService.myShifts(workerID);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Hasta 10 archivos
  @Post('uploadFile')
  async uploadFile(
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { incidentID?: number },
  ) {
    const workerID = req.user.workerID;
    const { incidentID } = body;
    const parsedIncidentID = incidentID ? Number(incidentID) : undefined;

    return this.workerService.uploadFile(
      files,
      workerID,
      'worker',
      parsedIncidentID,
    );
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Get('getIncidentHistory')
  async getIncidentHistory(
    @Req() req: any,
    @Query('workerID') workerID: string,
  ) {
    const incidentsIDNum = parseInt(workerID, 10);

    const id = req.user.workerID;
    const userType: UserType = 'worker';

    console.log('id value from request:', id);

    return this.workerService.getIncidentHistory(id, userType);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Post('incidentHistory')
  async incidentHistory(
    @Req() req,
    @Body()
    body: {
      incidentsID: number;
      changeType: string;
      oldValue?: string;
      newValue?: string;
      description?: string;
      closedAt?: Date;
    },
  ) {
    const workerID = req.user.workerID;
    const {
      incidentsID,
      changeType,
      oldValue,
      newValue,
      description,
      closedAt,
    } = body;

    return this.workerService.incidentHistory(
      workerID,
      'worker',
      incidentsID,
      changeType,
      oldValue,
      newValue,
      description,
      closedAt,
    );
  }
}
