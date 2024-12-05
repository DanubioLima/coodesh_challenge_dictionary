import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { DictionaryService } from '../../src/dictionary/dictionary.service';
import { Dictionary } from '../../src/dictionary/dictionary.entity';
import { DictionaryModule } from '../../src/dictionary/dictionary.module';
import { INestApplication } from '@nestjs/common';
import { getOrmModule } from '../test-helpers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../src/users/user.entity';
import nock from 'nock';

let app: INestApplication;
let service: DictionaryService;
let configService: ConfigService;
let repository: Repository<Dictionary>;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      DictionaryModule,
      ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
      getOrmModule(),
    ],
  }).compile();

  app = moduleFixture.createNestApplication();

  repository = moduleFixture.get('DictionaryRepository');
  service = moduleFixture.get(DictionaryService);
  configService = moduleFixture.get(ConfigService);

  await app.init();
});

afterEach(async () => {
  await repository.query(
    `DELETE FROM dictionary; DELETE FROM users; DELETE FROM history;`,
  );
  await app.close();
});

describe('DictionaryService - findAll', () => {
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

describe('DictionaryService - getWord', () => {
  it('should return word data and save visualized word in story', async () => {
    // ARRANGE
    const user = await insertUser();

    nock(configService.get('WORDS_API_URL'))
      .get('/v2/entries/en/test')
      .reply(200, { word: 'test' });

    // ACT
    const response = await service.getWord(user.id, 'test');

    // ASSERT
    expect(response).toEqual({ word: 'test' });

    const history = await repository.query(`SELECT * FROM history`);
    expect(history).toEqual([
      {
        id: expect.any(String),
        user_id: user.id,
        word: 'test',
        added: expect.any(Date),
      },
    ]);
  });

  async function insertUser() {
    const result = await repository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ name: 'john', email: 'john@gmail.com', password: 'password' })
      .execute();

    const user = result.generatedMaps[0];

    return user;
  }
});
