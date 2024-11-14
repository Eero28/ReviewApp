import { IsOptional, IsNotEmpty, IsInt, IsUrl } from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
    @IsNotEmpty()
    reviewname?: string;

    @IsOptional()
    @IsInt()
    reviewRating?: number;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsInt()
    id_user?: number; // If you want to update user as well, though usually it's not changed
}
