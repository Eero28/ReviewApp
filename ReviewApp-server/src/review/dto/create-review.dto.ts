import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  reviewname: string;

  @IsString()
  @IsNotEmpty()
  reviewDescription: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(5)
  @Type(() => Number)
  reviewRating: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  priceRange: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  reviewTaste: string[];
}
