import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { CompanyController } from './company/company.controller';
import { UserController } from './user/user.controller';
import { WorkerController } from './worker/worker.controller';
import { MachineryModule } from './machinery/machinery.module';

@Module({
  imports: [MachineryModule],
  controllers: [
    AppController,
    AdminController,
    CompanyController,
    UserController,
    WorkerController,
  ],
  providers: [AppService],
})
export class AppModule {}
