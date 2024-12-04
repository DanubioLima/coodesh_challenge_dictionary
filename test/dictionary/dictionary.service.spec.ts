import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { DictionaryService } from '../../src/dictionary/dictionary.service';
import { Dictionary } from '../../src/dictionary/dictionary.entity';
import { DictionaryModule } from '../../src/dictionary/dictionary.module';
import { INestApplication } from '@nestjs/common';
import { getOrmModule } from '../test-helpers';

describe('DictionaryService', () => {
  let app: INestApplication;
  let service: DictionaryService;
  let repository: Repository<Dictionary>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DictionaryModule, getOrmModule()],
    }).compile();

    app = moduleFixture.createNestApplication();

    repository = moduleFixture.get('DictionaryRepository');
    service = moduleFixture.get(DictionaryService);

    await app.init();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM dictionary;`);
    await app.close();
  });

  it('should return paginated results', async () => {
    await insertWords(['test1', 'test2']);

    const result = await service.findAll(1, 2, '');

    expect(result).toEqual({
      results: ['test1', 'test2'],
      totalDocs: 2,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('should return empty', async () => {
    const result = await service.findAll(1, 2, '');

    expect(result).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
  });

  function insertWords(words: string[]) {
    return Promise.all(words.map((word) => repository.insert({ word })));
  }
});
