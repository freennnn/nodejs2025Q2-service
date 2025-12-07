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
  async getFavorites(): Promise<FavoritesResponse> {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string): Promise<{
    message: string;
  }> {
    await this.favoritesService.addTrackToFavorites(id);
    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string): Promise<{
    message: string;
  }> {
    await this.favoritesService.addAlbumToFavorites(id);
    return { message: 'Album added to favorites successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string): Promise<{
    message: string;
  }> {
    await this.favoritesService.addArtistToFavorites(id);
    return { message: 'Artist added to favorites successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.removeArtistFromFavorites(id);
  }
}
