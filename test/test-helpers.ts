import { TypeOrmModule } from '@nestjs/typeorm';

export function getOrmModule() {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'dictionary_test',
    synchronize: true,
    autoLoadEntities: true,
    logging: false,
  });
}
