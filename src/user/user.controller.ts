import { Controller, Post, Get, UseGuards, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserGuard } from './user.guard';
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
  @UseGuards(AuthGuard, UserGuard)
  @Get('userMachinery')
  async findMyMachinery(@Query('userID') userID: string) {
    const userIDNum = parseInt(userID, 10);
    return this.userService.findMyMachinery(userIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Post('createIncident')
  async createIncident(
    @Body()
    body: {
      title: string;
      description: string;
      userID: number;
      companyID: number;
      status?: string;
      priority?: string;
      urgency?: boolean;
    },
  ) {
    const { title, description, userID, companyID, status, priority, urgency } =
      body;
    return this.userService.createIncident(
      title,
      description,
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
}
