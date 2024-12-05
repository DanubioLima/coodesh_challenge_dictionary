import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
