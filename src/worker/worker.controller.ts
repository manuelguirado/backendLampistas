import { Worker } from './../../generated/prisma/index.d';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WorkerService } from './worker.services';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
  @Post('workerLogin')
  async workerLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.workerService.workerLogin(email, password);
  }
  @Get('assignedIncidents')
  async listAssignedIncidents(@Query('workerID') workerID: string) {
    const workerIDNum = parseInt(workerID, 10);
    if (isNaN(workerIDNum)) {
      throw new BadRequestException('workerID must be a valid number');
    }
    return this.workerService.listAssignedIncidents(workerIDNum);
  }
  @Patch('updateIncidentStatus')
  async updateIncidentStatus(
    @Body() body: { incidentID: number; status: string },
  ) {
    const { incidentID, status } = body;
    return this.workerService.updateStatusIncident(incidentID, status);
  }
  @Get('myShifts')
  async myShifts(@Query('workerID') workerID: string) {
    const WorkerIDNum = parseInt(workerID, 10);
    if (isNaN(WorkerIDNum)) {
      throw new BadRequestException('workerID must be a valid number');
    }
    return this.workerService.myShifts(WorkerIDNum);
  }
}
