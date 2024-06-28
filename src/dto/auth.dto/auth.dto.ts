import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  readonly userName: string;

  @IsString()
  @MaxLength(8)
  @IsNotEmpty()
  readonly password: string;
}
