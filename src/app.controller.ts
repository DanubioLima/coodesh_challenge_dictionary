import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  root() {
    return {
      message: 'Fullstack Challenge 🏅 - Dictionary',
    };
  }
}
