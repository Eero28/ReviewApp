import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get()
    async findAll(): Promise<Review[]> {
        return await this.reviewService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Review> {
        return await this.reviewService.findOne(id)
    }

    @Get('user/:id_user')
    async findAllByUserId(@Param('id_user') id_user: number): Promise<Review[]> {
        return this.reviewService.findAllByUserId(id_user);
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
    async remove(@Param('id') id: number): Promise<void> {
        return await this.reviewService.remove(id)
    }

    @Put()
    async update(@Param('id') id: number, updateReview: CreateReviewDto): Promise<Review> {
        return await this.reviewService.update(id, updateReview)
    }

    @Post()
    async create(@Body() create: CreateReviewDto): Promise<Review> {
        console.log(create);
        return await this.reviewService.create(create)
    }

}
