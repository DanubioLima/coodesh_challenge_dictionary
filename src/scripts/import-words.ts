import { AppDataSource } from '../data-source';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

async function importWords(url: string) {
  const dataSource = await AppDataSource.initialize();

  const response = await fetch(url);

  fs.writeFileSync(
    'words_dictionary.json',
    JSON.stringify(await response.json()),
  );

  const words: Record<string, number> = JSON.parse(
    fs.readFileSync('words_dictionary.json', 'utf8'),
  );

  const batch = 1000;
  const wordsArray = Object.keys(words);
  const wordsBatches = [];
  for (let i = 0; i < wordsArray.length; i += batch) {
    wordsBatches.push(wordsArray.slice(i, i + batch));
  }

  await Promise.all(
    wordsBatches.map((batch) => insertBatch(dataSource, batch)),
  );
}

async function insertBatch(dataSource: DataSource, words: string[]) {
  const wordsToInsert = words.map((word) => ({ word }));

  await dataSource
    .createQueryBuilder()
    .insert()
    .into('dictionary')
    .values(wordsToInsert)
    .execute();
}

const URL =
  'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json';
importWords(URL).catch(console.error);
