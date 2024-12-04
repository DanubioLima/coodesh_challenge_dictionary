import { Controller, Get, Query } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { PaginationResponse } from './dictionary.types';

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
}
