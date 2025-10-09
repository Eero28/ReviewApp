import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { reviewStorage } from '../config/cloudinary.config';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAllReviews(
    @Query('limit') limit?: number,
    @Query('skip') skip = 0,
  ): Promise<Review[]> {
    return this.reviewService.findAllReviews(Number(limit) || 10, Number(skip));
  }

  @Get('category')
  async getReviewsByCategory(
    @Query('category') category: string,
    @Query('limit') limit?: number,
    @Query('skip') skip = 0,
  ): Promise<Review[]> {
    return this.reviewService.findReviewsByCategory(
      category,
      Number(limit) || 10,
      Number(skip),
    );
  }

  @Get(':id')
  async getReviewById(@Param('id') id_review: number): Promise<Review> {
    return this.reviewService.findReview(id_review);
  }

  @Get('user/:id_user')
  async getUserReviewsByCategory(
    @Param('id_user') id_user: number,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('skip') skip: number = 0,
  ): Promise<Review[]> {
    return this.reviewService.findAllByUserIdWithCategory(
      id_user,
      category,
      limit,
      skip,
    );
  }

  @Get('users/:id_user/reviews')
  async findAllByUserIdWithCategory(
    @Param('id_user') id_user: number,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('skip') skip = 0,
  ): Promise<Review[]> {
    return this.reviewService.findAllByUserIdWithCategory(
      id_user,
      category,
      Number(limit) || 10,
      Number(skip),
    );
  }

  @Get('user/favorites/:id_user')
  async getUserFavoriteReviews(
    @Param('id_user') id_user: number,
    @Query('limit') limit?: number,
    @Query('skip') skip = 0,
  ): Promise<Review[]> {
    return this.reviewService.findUserFavoriteReviews(
      id_user,
      Number(limit) || 10,
      Number(skip),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param('id') id: number, @Request() req): Promise<void> {
    return this.reviewService.deleteReview(id, req);
  }

  @Patch(':id_review')
  @UseInterceptors(FileInterceptor('file', { storage: reviewStorage }))
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id_review') id_review: number,
    @Body() updateReview: UpdateReviewDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Review> {
    return this.reviewService.updateReview(id_review, updateReview, req, file);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: reviewStorage }))
  async createReview(
    @Body() create: CreateReviewDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    console.log(create);
    console.log(file);
    const review = await this.reviewService.createReview(
      create,
      file,
      req.user,
    );
    return { message: 'Review created', data: review };
  }
}
