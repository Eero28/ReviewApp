import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetCommentDto, GetLikeDto, GetReviewDto, GetUserDto } from './dto/get-review.dto';

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

    async findAllReviews(): Promise<GetReviewDto[]> {
        const reviews = await this.reviewRepository.find({
            relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
            order:{
                createdAt: 'DESC'
            }
        });

        const mapUser = (user: GetUserDto) => ({
            id_user: user.id_user,
            username: user.username,
        });

        const mapLike = (like: GetLikeDto) => ({
            id_like: like.id_like,
            user: mapUser(like.user),
        });

        const mapComment = (comment: GetCommentDto) => ({
            id_comment: comment.id_comment,
            text: comment.text,
            user: mapUser(comment.user),
        });
        //format date
        const dateFormat = (date: Date) =>{
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "UTC"
              }).format(new Date(date));
            return formattedDate
        }

        return reviews.map(review => ({
            id_review: review.id_review,
            reviewname: review.reviewname,
            reviewRating: review.reviewRating,
            reviewDescription: review.reviewDescription,
            imageUrl: review.imageUrl,
            createdAt: dateFormat(review.createdAt),
            category: review.category,
            user: mapUser(review.user),
            likes: review.likes?.map(mapLike),
            comments: review.comments?.map(mapComment),
        }));
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

    async getUserReviewsByCategory(id_user: number): Promise<Review[]> {
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

        if(!id_user){
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
