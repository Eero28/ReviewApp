// user.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class UserDTO {
  @IsNumber()
  id_user: number;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  role: string;
}
