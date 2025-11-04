import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { CompanyController } from './company/company.controller';
import { UserController } from './user/user.controller';
import { WorkerController } from './worker/worker.controller';
import { MachineryModule } from './machinery/machinery.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
@Module({
  imports: [
    MachineryModule,
    AuthModule,
    AdminModule,
    CompanyModule,
    UserModule,
    WorkerModule,
  ],
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
