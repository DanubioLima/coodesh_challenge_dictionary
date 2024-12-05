import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { User } from '../users/user.entity';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User])],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
