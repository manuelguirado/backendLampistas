import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly jwtServ: JwtService) {}

  validateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.jwtServ.verify(token, {
        // use the same env var as JwtModule registration
        secret: process.env.JWT_SECRET || process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        console.error('Token validation error:', error);
      }
      return null; // o undefined
    }
  }
  createToken(payload: object) {
    return this.jwtServ.sign(payload);
  }
}
