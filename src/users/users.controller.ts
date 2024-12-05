import { Controller, Get } from '@nestjs/common';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/me')
  async profile(@CurrentUser() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.userService.findById(user.id);

    return rest;
  }
}
