import { IsNotEmpty, IsString, IsNumber, IsUrl, Min, Max, IsIn, isString } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    reviewname: string;

    reviewDescription: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    reviewRating: number;

    imageUrl: string;

    @IsIn(['softdrink', 'wine', 'beer'], { message: 'Category must be one of: softdrink, wine, beer' })
    category: string;

    id_user: number; 
}
