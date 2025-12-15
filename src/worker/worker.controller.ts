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
} from '@nestjs/common';
import { WorkerService } from './worker.services';
import type { incidentStatus } from '../utils/types/incidentStatus';
import { WorkerGuard } from './worker.guard';
import { AuthGuard } from '../auth/auth.guard';
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
    @Body() body: { incidentID: number; status: incidentStatus },
  ) {
    const { incidentID, status } = body;
    return this.workerService.updateStatusIncident(incidentID, status);
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
}
