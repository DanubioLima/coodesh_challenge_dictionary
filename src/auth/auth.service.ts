import { Injectable } from '@nestjs/common';
import { SignUpDto } from './auth.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignUpDto) {
    const { password, ...payload } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      ...payload,
      password: hashedPassword,
    });

    return this.signin(user);
  }

  async signin(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      id: user.id,
      name: user.name,
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}
