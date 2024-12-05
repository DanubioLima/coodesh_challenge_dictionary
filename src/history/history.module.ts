import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoryService } from './history.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, User])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
