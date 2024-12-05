import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HistoryService } from '../../src/history/history.service';
import { INestApplication } from '@nestjs/common';
import { getOrmModule } from '../test-helpers';
import { History } from '../../src/history/history.entity';
import { User } from '../../src/users/user.entity';
import { HistoryModule } from '../../src/history/history.module';

describe('HistoryService', () => {
  let app: INestApplication;
  let service: HistoryService;
  let repository: Repository<History>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HistoryModule, getOrmModule()],
    }).compile();

    app = moduleFixture.createNestApplication();

    repository = moduleFixture.get('HistoryRepository');
    service = moduleFixture.get(HistoryService);

    await app.init();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM users;`);
    await repository.query(`DELETE FROM history;`);
    await app.close();
  });

  it('should save a new word in history', async () => {
    // ARRANGE
    const user = await insertUser();

    // ACT
    await service.addWord(user.id, 'test');

    // ASSERT
    const result = await repository.query(`SELECT * FROM history;`);
    expect(result).toEqual([
      {
        id: expect.any(String),
        user_id: user.id,
        word: 'test',
        added: expect.any(Date),
      },
    ]);
  });

  it('should update a word in history', async () => {
    // ARRANGE
    const user = await insertUser();

    // ACT
    await service.addWord(user.id, 'test');
    await service.addWord(user.id, 'test');

    // ASSERT
    const result = await repository.query(`SELECT * FROM history;`);
    expect(result).toEqual([
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
