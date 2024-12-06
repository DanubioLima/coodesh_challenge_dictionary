import { Controller, Get, Query } from '@nestjs/common';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { PaginationResponse } from '../common/common.types';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/me')
  async profile(@CurrentUser() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.userService.findById(user.id);

    return rest;
  }

  @Get('/me/history')
  async getHistory(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse> {
    return this.userService.getHistory(page, limit, user.id);
  }

  @Get('/me/favorites')
  async getFavorites(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse> {
    return this.userService.getFavorites(page, limit, user.id);
  }
}
