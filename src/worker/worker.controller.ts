import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { WorkerService } from './worker.services';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
  @Post('worker/login')
  async workerLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.workerService.workerLogin(email, password);
  }
  @Get('worker/assignedIncidents')
  async listAssignedIncidents(@Query('workerID') workerID: number) {
    return this.workerService.listAssignedIncidents(workerID);
  }
  @Patch('worker/updateIncidentStatus')
  async updateIncidentStatus(
    @Body() body: { incidentID: number; status: string },
  ) {
    const { incidentID, status } = body;
    return this.workerService.updateStatusIncident(incidentID, status);
  }
  @Get('worker/myShifts')
  async myShifts(@Query('workerID') workerID: number) {
    return this.workerService.myShifts(workerID);
  }
}
