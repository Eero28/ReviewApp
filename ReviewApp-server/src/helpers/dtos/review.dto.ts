// review.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { UserDTO } from './user.dto';
import { Exclude } from 'class-transformer';
export class ReviewDTO {
  @IsNumber()
  id_review: number;

  @IsString()
  reviewname: string;

  @IsString()
  reviewDescription: string;

  @IsNumber()
  reviewRating: number;

  @IsString()
  imageUrl: string;

  @IsString()
  category: string;

  @Exclude()
  @IsString()
  createdAt: string;

  @Exclude()
  @IsString()
  updatedAt: string;

  @IsOptional()
  user?: UserDTO; // Including optional user details in the review
}
