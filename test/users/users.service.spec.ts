import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { getOrmModule } from '../test-helpers';
import { User } from '../../src/users/user.entity';
import { UsersService } from '../../src/users/users.service';
import { UsersModule } from '../../src/users/users.module';
import { History } from '../../src/history/history.entity';
import { HistoryModule } from '../../src/history/history.module';
import { Favorite } from '../../src/favorites/favorite.entity';
import { FavoritesModule } from '../../src/favorites/favorites.module';

let app: INestApplication;
let service: UsersService;
let repository: Repository<User>;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [UsersModule, HistoryModule, FavoritesModule, getOrmModule()],
  }).compile();

  app = moduleFixture.createNestApplication();

  repository = moduleFixture.get('UserRepository');
  service = moduleFixture.get(UsersService);

  await app.init();
});

afterEach(async () => {
  await repository.query(
    `DELETE FROM users; DELETE FROM history; DELETE FROM favorites;`,
  );
  await app.close();
});

describe('UsersService - getHistory', () => {
  it('should return visited words', async () => {
    const user = await insertUser();
    await insertWordsInHistory(user.id, ['test1', 'test2']);

    const result = await service.getHistory(1, 5, user.id);

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
    const user = await insertUser();
    const result = await service.getHistory(1, 5, user.id);

    expect(result).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
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

  async function insertWordsInHistory(userId: string, words: string[]) {
    await repository
      .createQueryBuilder()
      .insert()
      .into(History)
      .values(words.map((word) => ({ word, userId, added: new Date() })))
      .execute();
  }
});

describe('UsersService - getFavorites', () => {
  it('should return favorite words', async () => {
    const user = await insertUser();
    await insertWordsInFavorite(user.id, ['test1', 'test2']);

    const result = await service.getFavorites(1, 5, user.id);

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
    const user = await insertUser();
    const result = await service.getFavorites(1, 5, user.id);

    expect(result).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
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

  async function insertWordsInFavorite(userId: string, words: string[]) {
    await repository
      .createQueryBuilder()
      .insert()
      .into(Favorite)
      .values(words.map((word) => ({ word, userId, added: new Date() })))
      .execute();
  }
});
