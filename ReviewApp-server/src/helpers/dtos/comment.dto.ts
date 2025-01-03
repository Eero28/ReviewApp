// comment.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ReviewDTO } from './review.dto';
import { UserDTO } from './user.dto';

export class CommentDTO {
  @IsNumber()
  id_comment: number;

  @IsString()
  text: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  review?: ReviewDTO;

  @IsOptional()
  user?: UserDTO;
}
