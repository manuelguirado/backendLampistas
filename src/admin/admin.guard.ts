import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //check the role of the user
    const request: { user?: { id: string; role: string } } = context
      .switchToHttp()
      .getRequest();
    const user = request.user;
    if (user && user.role === 'admin') {
      return true;
    }
    return false;
  }
}
