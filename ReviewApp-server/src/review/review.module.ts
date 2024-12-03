import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Review,User,Comment])],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
