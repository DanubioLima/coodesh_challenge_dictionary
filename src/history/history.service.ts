import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './history.entity';
import { Repository } from 'typeorm';
import { PaginationResponse } from '../common/common.types';

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

  public async getHistory(
    page: number,
    limit: number,
    userId: string,
  ): Promise<PaginationResponse> {
    const [results, totalDocs] = await this.historyRepository.findAndCount({
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
