import { Controller, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Body, Post, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('company/login')
  companyLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.companyService.companyLogin(email, password);
  }
  @Post('company/register')
  registerCompany(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
      password: string;
      directions: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
      };
    },
  ) {
    const { name, email, phone, password, directions } = body;
    return this.companyService.registerCompany(
      name,
      email,
      phone,
      password,
      directions,
    );
  }
  @UseGuards(AuthGuard)
  @Post('company/registerWorker')
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
  @Patch('company/editWorker')
  editWorker(
    workerID,
    data: { email?: string; name?: string; password?: string },
  ) {
    return this.companyService.editWorker(workerID, data);
  }
  @UseGuards(AuthGuard)
  @Delete('company/deleteWorker')
  deleteWorker(workerID: number) {
    return this.companyService.eliminateWorker(workerID);
  }
  @UseGuards(AuthGuard)
  @Post('company/createBudget')
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
}
