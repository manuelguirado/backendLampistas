import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { adminServices } from './admin.services';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [adminServices],
  exports: [adminServices],
})
export class AdminModule {}
