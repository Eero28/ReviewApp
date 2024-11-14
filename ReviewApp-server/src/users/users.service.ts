// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id_user: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id_user } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id_user} not found`);
        }
        return user;
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async createUser(user: User): Promise<User> {
        user.password = await bcrypt.hash(user.password, 10);
        user.role = user.role || 'user';
        const newUser = this.usersRepository.create(user);
        return await this.usersRepository.save(newUser);
    }

    async updateUser(user: User, id: number | any): Promise<User> {
        const existingUser = await this.usersRepository.findOne(id);
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const updatedUser = this.usersRepository.merge(existingUser, user);
        return await this.usersRepository.save(updatedUser);
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
