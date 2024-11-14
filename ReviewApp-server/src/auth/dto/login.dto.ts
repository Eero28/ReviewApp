import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail() // Validate that this is a valid email format
    @IsNotEmpty() // Ensure this field is not empty
    email: string;

    @IsNotEmpty() // Ensure this field is not empty
    password: string;
}