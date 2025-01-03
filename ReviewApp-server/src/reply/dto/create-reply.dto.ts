import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  text: string; 

  @IsInt()
  @IsNotEmpty()
  id_comment: number; 

  @IsInt()
  @IsNotEmpty()
  id_user: number; 
}
