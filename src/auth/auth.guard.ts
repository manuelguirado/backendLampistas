import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context
        .switchToHttp()
        .getRequest<{ headers: { authorization?: string } }>();
      const authorization = request.headers.authorization;
      if (!authorization) {
        throw new UnauthorizedException('No authorization header');
      }
      const token = authorization.replace(/bearer/gim, '').trim();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resp = await this.authService.validateToken(token);
      if (!resp) {
        throw new UnauthorizedException('Invalid token');
      }
  // attach decoded token payload to request.user so downstream guards/controllers can read it
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  (request as any).user = resp;
      return true;
    } catch (error) {
      console.error('AuthGuard error:', error);
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
