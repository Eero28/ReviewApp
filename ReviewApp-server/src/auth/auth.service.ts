// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';// Create this DTO

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if(!user){
            throw new Error("Invalid credentials")
        }
        const payload = { email: user.email, sub: user.id_user, role: user.role, username: user.username };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
            email: user.email,
            userId: user.id_user,
            role: user.role,
            username: user.username

        };
    }
}
