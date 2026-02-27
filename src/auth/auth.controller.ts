import { Controller, Post, Body } from '@nestjs/common';
import { forgotPassword } from '../utils/forgotPassword';
import { refreshToken } from '../utils/refreshToken';
import type { UserType } from '../utils/types/userType';
@Controller('auth')
export class AuthController {
  @Post('forgotPassword')
  forgotPassword(
    @Body()
    body: {
      newPassword: string;
      email: string;
    },
  ) {
    return forgotPassword(body.newPassword, body.email);
  }

  @Post('refreshToken')
  refreshToken(
    @Body() body: { token: string; userType: UserType; id: number },
  ) {
    return refreshToken(body.token, body.userType, body.id);
  }
}
