// src/likes/dto/like-review-request.dto.ts
import { IsInt, IsPositive } from 'class-validator'; // class-validator decorators

export class LikeReviewRequestDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  reviewId: number;
}