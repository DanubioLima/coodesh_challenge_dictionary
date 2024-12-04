import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dictionary')
export class Dictionary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Unique(['word'])
  word: string;
}
