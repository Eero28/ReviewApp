import { Module, forwardRef } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';
import { TensorflowController } from './tensorflow.controller';
import { ReviewModule } from 'src/review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => ReviewModule),
    TypeOrmModule.forFeature([Review, User]),
  ],
  providers: [TensorflowService],
  controllers: [TensorflowController],
})
export class TensorflowModule {}
