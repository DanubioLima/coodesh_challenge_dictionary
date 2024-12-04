import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { DictionaryController } from './dictionary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [DictionaryService],
  controllers: [DictionaryController],
})
export class DictionaryModule {}
