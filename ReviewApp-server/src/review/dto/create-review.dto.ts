import { IsNotEmpty, IsString, IsNumber, IsUrl, Min, Max, IsIn, isString } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    reviewname: string;
    
    @IsString()
    @IsNotEmpty()
    reviewDescription: string;

    @IsNumber({maxDecimalPlaces: 2})
    @Min(1)
    @Max(5)
    reviewRating: number;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsIn(['softdrink', 'wine', 'beer'], { message: 'Category must be one of: softdrink, wine, beer' })
    category: string;

    @IsNumber()
    id_user: number; 
}
