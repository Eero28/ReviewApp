import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsNumber()
    id_review: number;

    @IsNotEmpty()
    @IsNumber()
    id_user: number;
  
}
