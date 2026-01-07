import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserGuard } from './user.guard';
import { UserType } from '../utils/types/userType';

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
  async findMyMachinery(@Req() req: any) {
    const userID = req.user.userID;
    return this.userService.findMyMachinery(userID);
  }
  @UseGuards(AuthGuard, UserGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Hasta 10 archivos
  @Post('createIncident')
  async createIncident(
    @Req() req: any,
    @Body()
    body: {
      title: string;
      description: string;
      location: string;
      priority?: string;
      urgency?: string; // Cambiar a string porque FormData envía strings
    },
    @UploadedFiles() files?: Express.Multer.File[], // Cambiar a UploadedFiles
  ) {
    const userID = req.user.userID;
    const companyID = req.user.companyID;

    if (!companyID) {
      throw new Error('El usuario no está asignado a ninguna empresa');
    }

    const { title, description, location, priority, urgency } = body;

    // Convertir urgency de string a boolean
    const urgencyBoolean =
      urgency === 'true' ? true : urgency === 'false' ? false : undefined;

    return this.userService.createIncident(
      title,
      description,
      location,
      userID,
      companyID,
      priority,
      urgencyBoolean, // Pasar el booleano convertido
      files, // Pasar archivos
    );
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('myContracts/:userID')
  async myContracts(@Query('userID') userID: string) {
    const userIDNum = parseInt(userID, 10);
    return this.userService.myContracts(userIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('recievedBudgets')
  async recievedBudgets(@Req() req: any) {
    const userID = req.user.userID;
    return this.userService.recievedBudgets(userID);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('myIncidents')
  async myIncidents(@Req() req: any) {
    const userID = req.user.userID;

    return this.userService.myIncidents(userID);
  }
  @UseGuards(AuthGuard, UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadFile')
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Query('incidentID') incidentID?: string,
  ) {
    const id = req.user.userID;
    const userType: UserType = 'user';
    const incidentIDNum = incidentID ? Number(incidentID) : undefined;

    return this.userService.uploadFile([file], id, userType, incidentIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('listFiles/:incidentID')
  async listFiles(@Req() req: any, @Param('incidentID') incidentID?: string) {
    console.log('Received incidentID param:', incidentID);
    const id = req.user.userID;
    const userType: UserType = 'user';
    const incidentIDNum = incidentID ? parseInt(incidentID, 10) : undefined;

    return this.userService.listFiles(id, userType, incidentIDNum);
  }
}
