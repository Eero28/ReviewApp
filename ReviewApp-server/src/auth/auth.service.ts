
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');
        
        return user;
      }
      

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException({
                message: 'Invalid credentials. Please check your email and password.',
            });
        }
        const payload = { email: user.email, sub: user.id_user, role: user.role, username: user.username, avatar: user.avatar };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
            email: user.email,
            id_user: user.id_user,
            role: user.role,
            username: user.username,
            avatar: user.avatar

        };
    }
}
