import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: { user?: { id: string; role: string } } = context
      .switchToHttp()
      .getRequest();
    const user = request.user;

    // Check if the user has the 'user' role
    if (user && user.role && user.role === 'user') {
      return true;
    }

    return false;
  }
}
