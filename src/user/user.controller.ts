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
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserGuard } from './user.guard';
import { UserType } from '../utils/types/userType';
import { parse } from 'path';

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
    @UploadedFiles() files?: Array<Express.Multer.File>,
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

    const incident = await this.userService.createIncident(
      title,
      description,
      location,
      userID,
      companyID,
      priority,
      urgencyBoolean, // Pasar el booleano convertido
    );

    // Si hay archivos, subirlos
    if (files && files.length > 0) {
      await this.userService.uploadFile(
        files,
        userID,
        'user',
        incident?.IncidentsID, // Pasar el incidentID aquí
      );
    }
    return incident;
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
  async myIncidents(
    @Req() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userID = req.user.userID;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;

    return this.userService.myIncidents(userID, limitNum, offsetNum);
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
    const incidentIDNum = incidentID ? parseInt(incidentID, 10) : undefined;

    return this.userService.uploadFile([file], id, userType, incidentIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @Get('listFiles/:incidentID')
  async listFiles(@Req() req: any, @Param('incidentID') incidentID?: string) {
    const id = req.user.userID;
    const userType: UserType = 'user';
    const incidentIDNum = incidentID ? parseInt(incidentID, 10) : undefined;

    return this.userService.listFiles(id, userType, incidentIDNum);
  }
  @UseGuards(AuthGuard, UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Get('downloadFile/:budgetID')
  async downloadFile(
    @Req() req: any,
    @Res() res: any,
    @Param('budgetID') budgetID?: string,
  ): Promise<void> {
    try {
      const id = req.user.userID;
      const userType: UserType = 'user';
      const parsedBudgetID = budgetID ? parseInt(budgetID, 10) : 0;
      const pdfFileName = `budget_${parsedBudgetID}.pdf`;

      const result = await this.userService.downloadFile(
        id,
        userType,
        parsedBudgetID,
      );

      // Extraer el Body del stream S3
      const stream = result.data.Body;

      if (!stream) {
        throw new Error('No file data received');
      }

      // Convertir el stream a buffer
      const chunks: Uint8Array[] = [];
      if (stream instanceof ReadableStream) {
        const reader = stream.getReader();
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            chunks.push(value);
          }
        }
      } else {
        // Handle Node.js stream
        for await (const chunk of stream as any) {
          chunks.push(chunk);
        }
      }
      const buffer = Buffer.concat(chunks);

      // Configurar headers con el tamaño correcto
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `attachment; filename="${pdfFileName}"`,
        'Cache-Control': 'no-cache',
      });

      // Enviar el buffer
      res.send(buffer);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: 'Error downloading file' });
    }
  }
}
