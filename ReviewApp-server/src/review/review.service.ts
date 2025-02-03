import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { TensorflowService } from 'src/tensorflow/tensorflow.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

    ) { }


    async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
        const user = await this.userRepository.findOne({
            where: { id_user: createReviewDto.id_user },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${createReviewDto.id_user} not found`);
        }


        const review = this.reviewRepository.create({
            ...createReviewDto,
            user,
        });


        return this.reviewRepository.save(review);
    }

    async findAllReviews(): Promise<Review[]> {
        const reviews = await this.reviewRepository.find({
            relations: [
                'user',
                'likes',
                'likes.user',
                'comments',
                'comments.user',
                'comments.replies',        // Add replies relation for each comment
                'comments.replies.user',   // Add user for each reply
            ],
            order: {
                createdAt: 'DESC',
            },
        });

        return reviews;
    }


    async getReviewsByCategory(category: string): Promise<Review[]> {
        const reviews = await this.reviewRepository.find({
            where: { category },
            relations: ['user'],
        });

        if (reviews.length === 0) {
            return [];
        }

        return reviews;
    }

    async getUserReviewsByid(id_user: number): Promise<Review[]> {
        if (!id_user) {
            throw new NotFoundException(`User with ID ${id_user} not found`);
        }
        const userReviews = await this.reviewRepository.find({
            where: { user: { id_user } },
            relations: ['user', 'likes', 'likes.user', 'comments'],
        });

        if (userReviews.length === 0) {
            return [];
        }

        return userReviews;
    }

    async findAllByUserIdWithCategory(id_user: number, category?: string): Promise<Review[]> {
        let userReviews;

        if (!id_user) {
            throw new NotFoundException(`User with ID ${id_user} not found`);
        }

        if (category) {
            userReviews = await this.reviewRepository.find({
                where: { user: { id_user }, category: category },
                relations: ['user'],
            });
        } else {
            userReviews = await this.reviewRepository.find({
                where: { user: { id_user } },
                relations: ['user'],
            });
        }

        if (userReviews.length === 0) {
            return [];
        }
        return userReviews;
    }




    async getReviewById(id_review: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({ where: { id_review }, relations: ['user', 'likes'] })

        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }

        return review;
    }

    async updateReview(id_review: number, updateReviewDto: UpdateReviewDto, id_user: number): Promise<Review> {

        const review = await this.reviewRepository.findOne({ where: { id_review }, relations: ['user'] });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found.`);
        }

        if (review.user.id_user !== id_user) {
            throw new ForbiddenException(`You are not authorized to update this review.`);
        }

        for (const key in updateReviewDto) {
            const value = updateReviewDto[key];
            if (value !== undefined && value !== null) {
                review[key] = value;
            }
        }

        await this.reviewRepository.save(review);


        const updatedReview = await this.reviewRepository.findOne({
            where: { user: { id_user } },
            relations: ['user', 'likes'],
        });

        if (!updatedReview) {
            throw new NotFoundException(`Updated review with ID ${id_review} could not be retrieved.`);
        }

        return updatedReview;
    }


    async deleteReview(id_review: number, req: any): Promise<void> {
        const user: User = req.user;

        const review = await this.reviewRepository.findOne({ where: { id_review } });
        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }

        if (review.user.id_user !== user.id_user) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        const result = await this.reviewRepository.delete(id_review);
        if (result.affected === 0) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }
    }
}
