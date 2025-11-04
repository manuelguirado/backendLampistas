import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
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
  async listAssignedIncidents(@Body() body: { workerID: number }) {
    const { workerID } = body;
    return this.workerService.listAssignedIncidents(workerID);
  }
  @Patch('worker/updateIncidentStatus')
  async updateStatusIncident(
    @Body()
    body: {
      incidentID: number;
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    },
  ) {
    const { incidentID, status } = body;
    return this.workerService.updateStatusIncident(incidentID, status);
  }
  @Get('worker/myShifts')
  async myShifts(@Body() body: { workerID: number }) {
    const { workerID } = body;
    return this.workerService.myShifts(workerID);
  }
}
