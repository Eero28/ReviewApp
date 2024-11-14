import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const user = await this.userRepository.findOne({
            where: { id_user: createReviewDto.id_user }
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

    async findAll(): Promise<Review[]> {
        return await this.reviewRepository.find({ relations: ['user'] });
    }

    async findAllByUserId(id_user: number): Promise<Review[]> {

        if (!id_user) {
            throw new Error("No id found!")
        }
        const userReviews = await this.reviewRepository.find({
            where: { user: { id_user } },
            relations: ['user'],
        });

        if (userReviews.length === 0) {
            return [];
        }

        return userReviews;
    }

    async findAllByUserIdWithCategory(id_user: number, category?: string): Promise<Review[]> {
        let userReviews;

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




    async findOne(id_review: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id_review },
            relations: ['user'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }

        return review;
    }

    async update(id_review: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.reviewRepository.findOne({ where: { id_review } });
        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }
        Object.assign(review, updateReviewDto);

        return this.reviewRepository.save(review);
    }

    async remove(id_review: number): Promise<void> {
        console.log(id_review)
        try {
            const result = await this.reviewRepository.delete(id_review);
            if (result.affected === 0) {
                throw new NotFoundException(`Review with ID ${id_review} not found`);
            }
        } catch (error) {
            throw new Error(`Error deleting review: ${error.message}`);
        }

    }
}
