import { Controller, Post, Body } from '@nestjs/common';
import type { UserType } from '../utils/types/userType';
import { refreshToken } from '../utils/refreshToken';
@Controller('auth')
export class AuthController {
  @Post('refreshToken')
  refreshToken(
    @Body() body: { token: string; userType: UserType; id: number },
  ) {
    return refreshToken(body.token, body.userType, body.id);
  }
}
