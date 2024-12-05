import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { Repository, ILike } from 'typeorm';
import { PaginationResponse } from '../common/common.types';
import { WordsService } from '../words/words.service';
import { HistoryService } from '../history/history.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    private readonly wordsService: WordsService,
    private readonly historyService: HistoryService,
    private readonly favoritesService: FavoritesService,
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

  async getWord(userId: string, word: string) {
    const response = await this.wordsService.getWord(word);

    await this.historyService.addWord(userId, word);

    return response;
  }

  async addFavorite(userId: string, word: string) {
    const wordExists = await this.dictionaryRepository.existsBy({ word });

    if (!wordExists) {
      throw new HttpException('Word does not exist in the dictionary', 400);
    }

    await this.favoritesService.addWord(userId, word);
  }

  async deleteFavorite(userId: string, word: string) {
    await this.favoritesService.deleteWord(userId, word);
  }
}
