import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppDataSource } from '../src/data-source';
import { DataSource } from 'typeorm';

@Injectable()
export class TestService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    this.dataSource = await AppDataSource.initialize();
  }

  public async cleanDatabase(): Promise<void> {
    try {
      const entities = this.dataSource.entityMetadatas;
      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(', ');

      await this.dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
  }

  public async runMigrations(): Promise<void> {
    const hasPendingMigrations = await this.dataSource.showMigrations();

    if (!hasPendingMigrations) {
      return;
    }

    await this.dataSource.runMigrations();
  }

  public async closeConnection(): Promise<void> {
    await this.dataSource.destroy();
  }
}
