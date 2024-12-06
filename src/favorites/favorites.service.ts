import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { PaginationResponse } from '../common/common.types';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  public async addWord(userId: string, word: string) {
    return await this.favoriteRepository.upsert(
      { userId, word, added: new Date() },
      {
        conflictPaths: ['userId', 'word'],
        upsertType: 'on-conflict-do-update',
      },
    );
  }

  public async deleteWord(userId: string, word: string) {
    return await this.favoriteRepository.delete({
      userId,
      word,
    });
  }

  public async getFavorites(
    page: number,
    limit: number,
    userId: string,
  ): Promise<PaginationResponse> {
    const [results, totalDocs] = await this.favoriteRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: (page - 1) * limit,
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
