import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto } from './auth.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  @HttpCode(200)
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  @HttpCode(200)
  async signin(@Request() req) {
    return this.authService.signin(req.user);
  }
}
