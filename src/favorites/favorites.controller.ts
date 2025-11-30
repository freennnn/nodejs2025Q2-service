import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
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
  addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favoritesService.addTrackToFavorites(id);
    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favoritesService.addAlbumToFavorites(id);
    return { message: 'Album added to favorites successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favoritesService.addArtistToFavorites(id);
    return { message: 'Artist added to favorites successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.removeArtistFromFavorites(id);
  }
}
