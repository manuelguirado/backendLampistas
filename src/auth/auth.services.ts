import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtServ: JwtService) {}

  validateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return this.jwtServ.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      console.error('Token validation error:', error);
      return null; // o undefined
    }
  }
  createToken(payload: object) {
    return this.jwtServ.sign(payload);
  }
}
