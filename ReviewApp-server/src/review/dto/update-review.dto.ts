import {
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  reviewname?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  reviewRating?: number; // Ensures that review rating is between 1 and 5

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
