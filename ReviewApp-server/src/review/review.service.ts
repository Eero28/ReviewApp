import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
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
  ): Promise<Review> {
    const user = await this.userRepository.findOne({
      where: { id_user: createReviewDto.id_user },
    });

    if (!user) throw new NotFoundException(`User not found`);
    if (!file) throw new NotFoundException('Image is required for a review');

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      imageUrl: file.path, // cloudinary secure_url
      imagePublicId: file.filename, // cloudinary public_id
    });

    return this.reviewRepository.save(review);
  }

  async findAllReviews(): Promise<Review[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor') // review author
      .leftJoinAndSelect('review.likes', 'likes') // review likes
      .leftJoinAndSelect('likes.user', 'liker') // user who liked
      .leftJoinAndSelect('review.comments', 'comments') // top-level comments
      .leftJoinAndSelect('comments.user', 'commentAuthor') // author of each comment
      .leftJoinAndSelect('comments.replies', 'commentReplies') // replies to top-level comments
      .leftJoinAndSelect('commentReplies.user', 'replyAuthor') // authors of replies
      .leftJoinAndSelect('commentReplies.replies', 'nestedReplies') // nested replies
      .leftJoinAndSelect('nestedReplies.user', 'nestedReplyAuthor') // authors of nested replies
      .orderBy('review.createdAt', 'DESC')
      .getMany();

    return reviews;
  }

  async getReviewsByCategoryAll(category: string): Promise<Review[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comment')
      .where('review.category = :category', { category })
      .getMany();

    if (reviews.length === 0) {
      return [];
    }
    return reviews;
  }

  async getUserReviewsByid(id_user: number): Promise<Review[]> {
    if (!id_user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    const userReviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comments')
      .where('reviewAuthor.id_user = :id_user', { id_user })
      .getMany();

    if (userReviews.length === 0) {
      return [];
    }

    return userReviews;
  }

  async getUserFavoriteReviews(id_user: number): Promise<Review[]> {
    if (!id_user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }
    const favorites = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'like')
      .leftJoinAndSelect('like.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comment')
      .where('liker.id_user = :id_user', { id_user })
      .getMany();

    console.log(favorites);

    if (favorites.length === 0) {
      return [];
    }
    return favorites;
  }

  async findAllByUserIdWithCategory(
    id_user: number,
    category?: string,
  ): Promise<Review[]> {
    if (!id_user) {
      throw new NotFoundException(`User with ID ${id_user} not found`);
    }

    const qb = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'reviewAuthor')
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'liker')
      .leftJoinAndSelect('review.comments', 'comments')
      .where('reviewAuthor.id_user = :id_user', { id_user });

    if (category) {
      qb.andWhere('review.category = :category', { category });
    }

    const userReviews = await qb.getMany();
    if (userReviews.length === 0) {
      return [];
    }
    return userReviews;
  }

  async getReviewById(id_review: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['user', 'likes'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    }

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
    if (review.user.id_user !== user.id_user) {
      throw new ForbiddenException(`You cannot update someone else's review`);
    }

    if (file) {
      // delete old image using public_id
      if (review.imagePublicId) {
        await cloudinary.uploader.destroy(review.imagePublicId);
      }
      // update image info with new file
      review.imageUrl = file.path;
      review.imagePublicId = file.filename;
    }
    // replace old review with updatereviewdto info
    Object.assign(review, updateReviewDto);

    return this.reviewRepository.save(review);
  }

  async deleteReview(id_review: number, req: any): Promise<void> {
    const user: User = req.user;

    const review = await this.reviewRepository.findOne({
      where: { id_review },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id_review} not found`);
    }

    if (review.user.id_user !== user.id_user) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // delete image when review is deleted
    if (review.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(review.imagePublicId);
      } catch (err) {
        console.error('Failed to delete review image from Cloudinary:', err);
      }
    }

    const result = await this.reviewRepository.delete(id_review);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Review with ID ${id_review} could not be deleted`,
      );
    }
  }
}
