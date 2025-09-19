import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateAvatarDto, UserStatsType } from 'src/helpers/dtos/user.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Get all users
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Get a single user by ID
  async findOne(id_user: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    // Fetch stats and assign to the user entity
    const userStats: UserStatsType = await this.getUserStats(user.id_user);
    user.stats = userStats;

    return user;
  }

  async getUserStats(id_user: number): Promise<UserStatsType> {
    const user = await this.usersRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    // Count likes
    const likesCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.likes', 'user_like')
      .where('user.id_user = :id_user', { id_user })
      .select('COUNT(user_like.id_like)', 'count')
      .getRawOne();

    const commentsCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.comments', 'comment')
      .where('user.id_user = :id_user', { id_user })
      .select('COUNT(comment.id_comment)', 'count')
      .getRawOne();

    const reviewsCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.reviews', 'review')
      .where('user.id_user = :id_user', { id_user })
      .select('COUNT(review.id_review)', 'count')
      .getRawOne();
    // make count as number
    return {
      likesCount: Number(likesCount.count) || 0,
      commentsCount: Number(commentsCount.count) || 0,
      reviewsCount: Number(reviewsCount.count) || 0,
    };
  }

  // Get a user by email
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Create a new user
  async createUser(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    user.role = user.role || 'user';
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  // Update user info
  async updateUser(userData: Partial<User>, id_user: number): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id_user },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }
    const userStats: UserStatsType = await this.getUserStats(
      existingUser.id_user,
    );
    existingUser.stats = userStats;

    const updatedUser = this.usersRepository.merge(existingUser, userData);
    return this.usersRepository.save(updatedUser);
  }

  // Update user avatar
  async updateUserAvatar(
    updateAvatarDto: UpdateAvatarDto,
    id_user: number,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id_user },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    // Delete old avatar from Cloudinary if exists
    if (existingUser.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(existingUser.avatarPublicId);
      } catch (err) {
        console.error('Failed to delete old avatar:', err);
      }
    }

    // Save new avatar info
    existingUser.avatar = updateAvatarDto.avatar;
    existingUser.avatarPublicId = updateAvatarDto.public_id;

    const updatedUser = await this.usersRepository.save(existingUser);

    updatedUser.stats = await this.getUserStats(id_user);

    return updatedUser;
  }

  async deleteUser(id_user: number): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { id_user },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    // Delete avatar from Cloudinary if exists
    if (existingUser.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(existingUser.avatarPublicId);
      } catch (err) {
        console.error('Failed to delete user avatar from Cloudinary:', err);
      }
    }

    const result = await this.usersRepository.delete(id_user);
    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id_user} could not be deleted`,
      );
    }
  }
}
