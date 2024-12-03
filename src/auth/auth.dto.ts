import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6, {
    message: 'Password is too short, it should have at least 6 characters',
  })
  @IsNotEmpty()
  password!: string;
}

export class SignInDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
