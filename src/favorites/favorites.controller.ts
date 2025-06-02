import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './favorites.interface';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites(): FavoritesResponse {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string): { message: string } {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    this.favoritesService.addTrackToFavorites(id);
    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string): { message: string } {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    this.favoritesService.addAlbumToFavorites(id);
    return { message: 'Album added to favorites successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string): { message: string } {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    this.favoritesService.addArtistToFavorites(id);
    return { message: 'Artist added to favorites successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    this.favoritesService.removeArtistFromFavorites(id);
  }
}
