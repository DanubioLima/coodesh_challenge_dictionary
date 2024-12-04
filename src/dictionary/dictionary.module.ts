import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [DictionaryService],
})
export class DictionaryModule {}
