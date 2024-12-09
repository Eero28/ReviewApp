import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateReviewDto } from './dto/update-review.dto';
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get()
    async findAllReviews(): Promise<any> {
        return await this.reviewService.findAllReviews()
    }

    @Get('all')
    async getReviewsByCategory(@Query('category') category: string): Promise<Review[]> {
        return await this.reviewService.getReviewsByCategory(category)
    }

    @Get(':id')
    async getReviewById(@Param('id') id_review: number): Promise<Review> {
        return await this.reviewService.getReviewById(id_review)
    }

    @Get('user/:id_user')
    async getUserReviewsByCategory(@Param('id_user') id_user: number): Promise<Review[]> {
        return this.reviewService.getUserReviewsByCategory(id_user);
    }

    @Get('users/:id_user/reviews')
    async findAllByUserIdWithCategory(
        @Param('id_user') id_user: number,
        @Query('category') category?: string
    ): Promise<Review[]> {
        return this.reviewService.findAllByUserIdWithCategory(id_user, category);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteReview(@Param('id') id: number, @Request() req): Promise<void> {
        return await this.reviewService.deleteReview(id, req)
    }

    @Put()
    async updateReview(
        @Body('id_review') id_review: number,
        @Body('id_user') id_user: number,
        @Body() updateReview: UpdateReviewDto 
    ): Promise<Review> {
        return await this.reviewService.updateReview(id_review, updateReview, id_user);
    }

    @Post()
    async createReview(@Body() create: CreateReviewDto): Promise<Review> {
        return await this.reviewService.createReview(create)
    }

}
