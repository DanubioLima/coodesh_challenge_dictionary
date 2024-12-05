import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { PaginationResponse } from './dictionary.types';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../users/user.entity';

@Controller('entries/en')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ): Promise<PaginationResponse> {
    return this.dictionaryService.findAll(page, limit, search);
  }

  @Get('/:word')
  async findOne(@CurrentUser() user: User, @Param('word') word: string) {
    return this.dictionaryService.getWord(user.id, word);
  }

  @Post('/:word/favorite')
  async addFavorite(@CurrentUser() user: User, @Param('word') word: string) {
    return this.dictionaryService.addFavorite(user.id, word);
  }
}
