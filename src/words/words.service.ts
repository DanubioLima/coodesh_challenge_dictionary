import { Injectable } from '@nestjs/common';
import { WordData } from './words.types';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WordsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getWord(word: string): Promise<WordData> {
    const response = await this.getResponse(`v2/entries/en/${word}`);

    return response;
  }

  private async getResponse(url: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.getBaseURL()}/${url}`),
    );

    return response.data;
  }

  private getBaseURL() {
    return this.configService.get<string>('WORDS_API_URL');
  }
}
