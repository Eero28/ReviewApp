import { IsString, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @IsNumber()
  id_user: number;

  @Exclude()
  @IsString()
  password: string;

  @Exclude()
  @IsString()
  email: string;

  @IsString()
  username: string;

  @Exclude()
  @IsString()
  role: string;
}

export class UpdateAvatarDto {
  @IsString()
  avatar: string;

  @IsString()
  public_id?: string; // need for deleting the old image
}

export class UserStatsType {
  commentsCount: number;
  likesCount: number;
  reviewsCount: number;
}
