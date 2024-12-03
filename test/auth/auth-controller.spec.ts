import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { TestService } from '../test.service';
import Redis from 'ioredis';

let app: INestApplication;
let redis: Redis;
let testService: TestService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [TestService],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  testService = moduleFixture.get(TestService);
  redis = app.get<Redis>('REDIS_CLIENT');

  await testService.runMigrations();
  await testService.cleanDatabase();

  await app.init();
});

afterEach(async () => {
  await testService.cleanDatabase();
  await redis.quit();
  await testService.closeConnection();
  await app.close();
});

describe('AuthController - Signup', () => {
  it('should signup', async () => {
    // ARRANGE
    const payload = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password',
    };

    // ACT
    const response = await request(app.getHttpServer())
      .post(`/auth/signup`)
      .send(payload)
      .expect(200);

    // ASSERT
    expect(response.body).toEqual({
      id: expect.any(String),
      name: payload.name,
      token: expect.any(String),
    });
  });
});

describe('AuthController - Signin', () => {
  it('should return error when password is wrong', async () => {
    // ARRANGE
    await createUser({
      name: 'John',
      email: 'john@gmail.com',
      password: 'password',
    });

    // ACT
    const response = await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({ email: 'john@gmail.com', password: 'wrong-password' });

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Email ou senha inválidos',
    });
  });

  it('should return access token', async () => {
    // ARRANGE
    const user = await createUser({
      name: 'Bob',
      email: 'bob@gmail.com',
      password: 'password',
    });

    // ACT
    const response = await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({ email: 'bob@gmail.com', password: 'password' });

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      token: expect.any(String),
    });
  });
});

async function createUser(payload) {
  const response = await request(app.getHttpServer())
    .post(`/auth/signup`)
    .send(payload)
    .expect(200);

  return response.body;
}
