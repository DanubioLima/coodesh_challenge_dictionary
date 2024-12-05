import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  public async addWord(userId: string, word: string) {
    return await this.historyRepository.upsert(
      { userId, word, added: new Date() },
      {
        conflictPaths: ['userId', 'word'],
        upsertType: 'on-conflict-do-update',
      },
    );
  }
}
