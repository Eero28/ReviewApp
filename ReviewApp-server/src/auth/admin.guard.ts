import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // The user is already attached by JwtStrategy

        if (!user || user.role !== 'admin') {
            throw new ForbiddenException('Access denied: You do not have permission');
        }

        return true; // User is an admin, allow access
    }
}