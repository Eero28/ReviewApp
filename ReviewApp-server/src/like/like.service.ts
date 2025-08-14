import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async deleteLike(id_user: number, id_review: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id_user } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id_user} not found`);
      }
      const review = await this.reviewRepository.findOne({
        where: { id_review },
        relations: ['likes'],
      });
      if (!review) {
        throw new NotFoundException(`Review with ID ${id_review} not found`);
      }

      // find if already unliked
      const existingLike = review.likes.find(
        (like) => like.user.id_user === user.id_user,
      );

      if (!existingLike) {
        throw new BadRequestException('You have already unliked this review');
      }

      await this.likeRepository.delete({ id_like: existingLike.id_like });
    } catch (error) {
      console.error('Error deleting like:', error.message);
      throw error;
    }
  }

  async likeReview(id_user: number, id_review: number): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['likes'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    }

    const existingLike = review.likes.find(
      (like) => like.user.id_user === user.id_user,
    );
    if (existingLike) {
      throw new BadRequestException('You have already liked this review');
    }

    const newLike = this.likeRepository.create({
      user: user,
      review: review,
    });

    await this.likeRepository.save(newLike);

    const updatedReview = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['likes'],
    });
    return updatedReview;
  }

  async getUsersWhoLikedReview(id_review: number): Promise<User[]> {
    if (!id_review) {
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    }

    const likes = await this.likeRepository.find({
      where: { review: { id_review } },
      relations: ['user'],
    });
    const usersWhoLiked = likes.map((like) => like.user);
    return usersWhoLiked;
  }

  async getUserLikedReviews(id_user: number): Promise<Review[]> {
    const user = await this.userRepository.findOne({
      where: { id_user: id_user },
    });

    if (!user) {
      throw new Error(`User with ID ${id_user} not found`);
    }

    const likes = await this.likeRepository.find({
      where: { user: { id_user: id_user } },
      relations: ['review'],
    });

    const reviews = likes.map((like) => like.review);

    return reviews;
  }
}
