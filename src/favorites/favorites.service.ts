import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { FavoritesResponse, Favorites } from './favorites.interface';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  getFavorites(): FavoritesResponse {
    const favoriteArtists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          // Remove invalid IDs from favorites
          this.favorites.artists = this.favorites.artists.filter(
            (artistId) => artistId !== id,
          );
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const favoriteAlbums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          // Remove invalid IDs from favorites
          this.favorites.albums = this.favorites.albums.filter(
            (albumId) => albumId !== id,
          );
          return null;
        }
      })
      .filter((album) => album !== null);

    const favoriteTracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          // Remove invalid IDs from favorites
          this.favorites.tracks = this.favorites.tracks.filter(
            (trackId) => trackId !== id,
          );
          return null;
        }
      })
      .filter((track) => track !== null);

    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    };
  }

  addTrackToFavorites(id: string): void {
    try {
      this.tracksService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrackFromFavorites(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  // Method to remove track from favorites without throwing error if not found
  removeTrackFromFavoritesIfExists(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }

  addAlbumToFavorites(id: string): void {
    try {
      this.albumsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbumFromFavorites(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  // Method to remove album from favorites without throwing error if not found
  removeAlbumFromFavoritesIfExists(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  addArtistToFavorites(id: string): void {
    try {
      this.artistsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtistFromFavorites(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }

  // Method to remove artist from favorites without throwing error if not found
  removeArtistFromFavoritesIfExists(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }
}
