import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('user/useerRegister')
  async register(
    @Body() userData: { name: string; email: string; password: string },
  ) {
    return this.userService.userRegister(
      userData.name,
      userData.email,
      userData.password,
    );
  }
  @Post('user/userLogin')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.userService.userLogin(email, password);
  }
  @UseGuards(AuthGuard)
  @Get('user/userMachinery')
  async findMyMachinery(@Body() body: { userID: number }) {
    const { userID } = body;
    return this.userService.findMyMachinery(userID);
  }
  @UseGuards(AuthGuard)
  @Post('user/createIncident')
  async createIncident(
    @Body()
    body: {
      title: string;
      description: string;
      machineryID: number;
      userID: number;
    },
  ) {
    const { title, description, machineryID, userID } = body;
    return this.userService.createIncident(
      title,
      description,
      machineryID,
      userID,
    );
  }
}
