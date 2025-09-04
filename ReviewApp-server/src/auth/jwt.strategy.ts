import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    payload: { sub: number; email: string },
  ): Promise<User> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException(
        { message: 'No token provided' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          { message: 'Token expired' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException(
          { message: 'Invalid token' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        { message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Fetch the user
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new HttpException(
        { message: 'Invalid token: user not found' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
