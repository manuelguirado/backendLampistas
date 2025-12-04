import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserGuard } from './user.guard';
import type { incidentStatus } from '../utils/types/incidentStatus';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('userRegister')
  async register(
    @Body() userData: { name: string; email: string; password: string },
  ) {
    return this.userService.userRegister(
      userData.name,
      userData.email,
      userData.password,
    );
  }
  @Post('userLogin')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.userService.userLogin(email, password);
  }
  @Post('validateCode')
  async validateCode(@Body() body: { userType: 'user'; code: string }) {
    const { userType, code } = body;
    return this.userService.validateCode(userType, code);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('userMachinery')
  async findMyMachinery(@Query('userID') userID: string) {
    const userIDNum = parseInt(userID, 10);
    return this.userService.findMyMachinery(userIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Post('createIncident')
  async createIncident(
    @Req() req: any,
    @Body()
    body: {
      title: string;
      description: string;
      location: string;
      status?: incidentStatus;
      priority?: string;
      urgency?: boolean;
    },
  ) {
    console.log('Request Body:', body);
    const userID = req.user.userID;
    const companyID = req.user.companyID;
    console.log('UserID from token:', userID);
    console.log('CompanyID from token:', companyID);

    if (!companyID) {
      throw new Error('El usuario no está asignado a ninguna empresa');
    }

    const { title, description, location, status, priority, urgency } = body;
    return this.userService.createIncident(
      title,
      description,
      location,
      userID,
      companyID,
      status,
      priority,
      urgency,
    );
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('myContracts/:userID')
  async myContracts(@Query('userID') userID: string) {
    const userIDNum = parseInt(userID, 10);
    return this.userService.myContracts(userIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('recievedBudgets/:userID')
  async recievedBudgets(@Query('userID') userID: string) {
    const userIDNum = parseInt(userID, 10);
    return this.userService.recievedBudgets(userIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('myIncidents')
  async myIncidents(@Req() req: any) {
    const userID = req.user.userID;

    return this.userService.myIncidents(userID);
  }
}
