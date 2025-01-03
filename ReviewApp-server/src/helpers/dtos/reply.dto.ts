// reply.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CommentDTO } from './comment.dto';
import { UserDTO } from './user.dto';

export class ReplyDTO {
  @IsString()
  text: string;

  @IsOptional()
  comment?: CommentDTO;

  @IsOptional()
  user?: UserDTO;

  @IsNumber()
  id_reply: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
