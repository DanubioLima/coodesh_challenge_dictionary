import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const envFilePath =
  process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dictionary',
      entities: [],
      synchronize: true,
    }),
    RedisModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
