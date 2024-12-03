import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @Unique(['email'])
  email: string;

  @Column({ nullable: false })
  password: string;
}
