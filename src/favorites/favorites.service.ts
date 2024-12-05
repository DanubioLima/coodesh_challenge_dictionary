import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

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
}
