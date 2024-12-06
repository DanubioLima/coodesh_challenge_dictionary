import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { HistoryService } from '../history/history.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly historyService: HistoryService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getHistory(page: number, limit: number, userId: string) {
    return this.historyService.getHistory(page, limit, userId);
  }

  async getFavorites(page: number, limit: number, userId: string) {
    return this.favoritesService.getFavorites(page, limit, userId);
  }
}
