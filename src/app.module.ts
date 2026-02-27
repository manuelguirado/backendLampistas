import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { CompanyController } from './company/company.controller';
import { UserController } from './user/user.controller';
import { WorkerController } from './worker/worker.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
import { PaymentsModule } from './payments/payments.module';
import { MailingModule } from './mailing/mailing.module';
@Module({
  imports: [
    AuthModule,
    AdminModule,
    CompanyModule,
    UserModule,
    WorkerModule,
    PaymentsModule,
    MailingModule,
  ],
  controllers: [
    AppController,
    AdminController,
    CompanyController,
    UserController,
    WorkerController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule {}
