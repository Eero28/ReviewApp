import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { TensorflowModule } from 'src/tensorflow/tensorflow.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User]),
    TensorflowModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
