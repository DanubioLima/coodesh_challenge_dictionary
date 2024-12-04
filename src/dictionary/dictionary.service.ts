import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { Repository, ILike } from 'typeorm';
import { PaginationResponse } from './dictionary.types';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginationResponse> {
    const [results, totalDocs] = await this.dictionaryRepository.findAndCount({
      where: search ? { word: ILike(`%${search}%`) } : {},
      take: limit,
      skip: (page - 1) * limit,
      select: { word: true },
    });

    return {
      results: results.map((result) => result.word),
      totalDocs,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNext: page * limit < totalDocs,
      hasPrev: page > 1,
    };
  }
}
