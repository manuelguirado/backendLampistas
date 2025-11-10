import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WorkerService } from './worker.services';
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
  async listAssignedIncidents(@Query('workerID') workerID: string) {
    const workerIDNum = parseInt(workerID, 10);
    if (isNaN(workerIDNum)) {
      throw new BadRequestException('workerID must be a valid number');
    }
    return this.workerService.listAssignedIncidents(workerIDNum);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Patch('updateIncidentStatus')
  async updateIncidentStatus(
    @Body() body: { incidentID: number; status: string },
  ) {
    const { incidentID, status } = body;
    return this.workerService.updateStatusIncident(incidentID, status);
  }
  @UseGuards(AuthGuard, WorkerGuard)
  @Get('myShifts')
  async myShifts(@Query('workerID') workerID: string) {
    const WorkerIDNum = parseInt(workerID, 10);
    if (isNaN(WorkerIDNum)) {
      throw new BadRequestException('workerID must be a valid number');
    }
    return this.workerService.myShifts(WorkerIDNum);
  }
}
