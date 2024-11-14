// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    
    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }
    
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Post('register')
    async createUser(@Body() user: User): Promise<User> {
        return await this.usersService.createUser(user);
    }

    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() user: User): Promise<User> {
        return await this.usersService.updateUser(user, id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        return await this.usersService.deleteUser(id);
    }
}

  

