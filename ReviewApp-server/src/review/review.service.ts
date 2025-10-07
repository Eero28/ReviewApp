import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Review> {
    if (!file) throw new NotFoundException('Image is required');

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      imageUrl: file.path,
      imagePublicId: file.filename,
    });

    return this.reviewRepository.save(review);
  }

  async findAllReviews(limit = 5, offset = 0): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async getReviewsByCategoryAll(
    category: string,
    limit = 5,
    offset = 0,
  ): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comment')
      .where('review.category = :category', { category })
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async getUserReviewsByid(
    id_user: number,
    limit = 10,
    offset = 0,
  ): Promise<Review[]> {
    if (!id_user)
      throw new NotFoundException(`User with ID ${id_user} not found`);

    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comments')
      .where('reviewAuthor.id_user = :id_user', { id_user })
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async getUserFavoriteReviews(
    id_user: number,
    limit = 10,
    offset = 0,
  ): Promise<Review[]> {
    if (!id_user)
      throw new NotFoundException(`User with ID ${id_user} not found`);

    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'like')
      .leftJoinAndSelect('like.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comment')
      .where('liker.id_user = :id_user', { id_user })
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async findAllByUserIdWithCategory(
    id_user: number,
    category?: string,
    limit = 10,
    offset = 0,
  ): Promise<Review[]> {
    if (!id_user)
      throw new NotFoundException(`User with ID ${id_user} not found`);

    const qb = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comments')
      .where('reviewAuthor.id_user = :id_user', { id_user });

    if (category) qb.andWhere('review.category = :category', { category });

    return qb
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async getReviewById(id_review: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['user', 'likes', 'comments'],
    });
    if (!review)
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    return review;
  }

  async updateReview(
    id_review: number,
    updateReviewDto: UpdateReviewDto,
    req: any,
    file?: Express.Multer.File,
  ): Promise<Review> {
    const user: User = req.user;
    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['user'],
    });
    if (!review) throw new NotFoundException(`Review not found`);
    if (review.user.id_user !== user.id_user)
      throw new ForbiddenException(`You cannot update someone else's review`);

    if (file) {
      if (review.imagePublicId)
        await cloudinary.uploader.destroy(review.imagePublicId);
      review.imageUrl = file.path;
      review.imagePublicId = file.filename;
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async deleteReview(id_review: number, req: any): Promise<void> {
    const user: User = req.user;
    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['user'],
    });
    if (!review)
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    if (review.user.id_user !== user.id_user)
      throw new ForbiddenException('You can only delete your own reviews');

    if (review.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(review.imagePublicId);
      } catch (err) {
        console.error('Failed to delete review image from Cloudinary:', err);
      }
    }

    const result = await this.reviewRepository.delete(id_review);
    if (result.affected === 0)
      throw new NotFoundException(
        `Review with ID ${id_review} could not be deleted`,
      );
  }
}
