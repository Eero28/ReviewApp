import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ReviewDTO } from './review.dto';
import { UserDTO } from './user.dto';
import { Exclude } from 'class-transformer';
export class CommentDTO {
  @IsNumber()
  id_comment: number;

  @IsString()
  text: string;

  @Exclude()
  @IsString()
  createdAt: string;

  @Exclude()
  @IsString()
  updatedAt: string;

  @Exclude()
  @IsOptional()
  review?: ReviewDTO;

  @IsOptional()
  user?: UserDTO;

  @IsOptional()
  replies?: CommentDTO[];

  @IsOptional()
  parentId?: number;
}
