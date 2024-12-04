import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Dictionary } from './dictionary/dictionary.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'dictionary',
  synchronize: true,
  logging: false,
  entities: [User, Dictionary],
  subscribers: [],
  migrations: [],
});
