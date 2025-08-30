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
  @IsNotEmpty()
  reviewDescription?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  reviewRating?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @IsNotEmpty()
  priceRange?: string;

  @IsOptional()
  reviewTaste?: string[];
}
