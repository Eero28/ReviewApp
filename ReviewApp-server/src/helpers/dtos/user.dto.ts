// user.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
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
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNumber()
  id_user: number;
}
