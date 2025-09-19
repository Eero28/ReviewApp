import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { reviewStorage } from '../../config/cloudinary.config';
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAllReviews(): Promise<any> {
    return await this.reviewService.findAllReviews();
  }

  @Get('all')
  async getReviewsByCategory(
    @Query('category') category: string,
  ): Promise<Review[]> {
    return await this.reviewService.getReviewsByCategoryAll(category);
  }

  @Get(':id')
  async getReviewById(@Param('id') id_review: number): Promise<Review> {
    return await this.reviewService.getReviewById(id_review);
  }

  @Get('user/:id_user')
  async getUserReviewsByCategory(
    @Param('id_user') id_user: number,
  ): Promise<Review[]> {
    return this.reviewService.getUserReviewsByid(id_user);
  }

  @Get('users/:id_user/reviews')
  async findAllByUserIdWithCategory(
    @Param('id_user') id_user: number,
    @Query('category') category?: string,
  ): Promise<Review[]> {
    return this.reviewService.findAllByUserIdWithCategory(id_user, category);
  }

  @Get('user/favorites/:id_user')
  async getUserFavoriteReviews(
    @Param('id_user') id_user: number,
  ): Promise<Review[]> {
    return this.reviewService.getUserFavoriteReviews(id_user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.reviewService.deleteReview(id, req);
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
    return await this.reviewService.updateReview(
      id_review,
      updateReview,
      req,
      file,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: reviewStorage }))
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() create: CreateReviewDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Review> {
    return await this.reviewService.createReview(create, file);
  }
}
