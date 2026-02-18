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
  Param,
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
    try {
      return await this.workerService.workerLogin(email, password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al iniciar sesión';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  @UseGuards(AuthGuard, WorkerGuard)
  @Get('assignedIncidents')
  async listAssignedIncidents(
    @Req() req,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const workerID = req.user?.workerID; // ✅ Cambiar a workerID mayúscula

    if (!workerID) {
      throw new BadRequestException('Worker ID not found in token');
    }
    const limitNum = limit ? Number(limit) : 5;
    const offsetNum = offset ? Number(offset) : 0;

    return this.workerService.listAssignedIncidents(
      workerID,
      search,
      limitNum,
      offsetNum,
    );
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
  @UseGuards(AuthGuard, WorkerGuard)
  @Get('getIncidentPhotos')
  async getIncidentPhotos(@Req() req, @Query('incidentID') incidentID: string) {
    console.log('Received incidentID:', incidentID); // Agrega este log para verificar el valor recibido
    const incidentIDNum = parseInt(incidentID, 10);

    return this.workerService.getIncidentPhotos(incidentIDNum);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Get('getDirections/:incidentID')
  async getDirections(@Req() req, @Param('incidentID') incidentID?: string) {
    const workerID = req.user.workerID;
    console.log('Worker ID in getDirections controller:', workerID); // Agrega este log para verificar el valor recibido
    const incidentIDNum = incidentID ? parseInt(incidentID, 10) : undefined;
    console.log('Incident ID in getDirections controller:', incidentIDNum); // Agrega este log para verificar el valor recibido
    return this.workerService.getDirections(workerID, incidentIDNum);
  }
}
