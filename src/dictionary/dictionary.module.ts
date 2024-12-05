import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { DictionaryController } from './dictionary.controller';
import { WordsModule } from '../words/words.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary]), WordsModule, HistoryModule],
  providers: [DictionaryService],
  controllers: [DictionaryController],
})
export class DictionaryModule {}
