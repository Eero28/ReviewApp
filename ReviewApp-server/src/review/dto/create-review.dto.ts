import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayNotEmpty,
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
  reviewRating: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  reviewTaste: string[];

  @IsNumber()
  id_user: number;
}
