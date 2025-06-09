import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponse } from './favorites.interface';

@Injectable()
export class FavoritesService {
  // Use a proper UUID for the global user to match schema constraints
  private readonly GLOBAL_USER_ID = '00000000-0000-0000-0000-000000000001';

  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(): Promise<FavoritesResponse> {
    // Ensure global user exists first
    await this.ensureGlobalUserExists();

    // Get or create the global favorites record
    let favorites = await this.prisma.favorites.findUnique({
      where: { userId: this.GLOBAL_USER_ID },
      include: {
        artists: { include: { artist: true } },
        albums: { include: { album: true } },
        tracks: { include: { track: true } },
      },
    });

    // If global favorites don't exist yet, create them
    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: { userId: this.GLOBAL_USER_ID },
        include: {
          artists: { include: { artist: true } },
          albums: { include: { album: true } },
          tracks: { include: { track: true } },
        },
      });
    }

    return {
      artists: favorites.artists.map((fa) => fa.artist),
      albums: favorites.albums.map((fa) => fa.album),
      tracks: favorites.tracks.map((ft) => ft.track),
    };
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    // Verify track exists
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${trackId} doesn't exist`,
      );
    }

    // Get or create global favorites record
    const favorites = await this.getOrCreateGlobalFavorites();

    // Check if already in favorites
    const existingFavorite = await this.prisma.favoriteTrack.findUnique({
      where: {
        favoritesId_trackId: {
          favoritesId: favorites.id,
          trackId: trackId,
        },
      },
    });

    if (!existingFavorite) {
      await this.prisma.favoriteTrack.create({
        data: {
          favoritesId: favorites.id,
          trackId: trackId,
        },
      });
    }
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { userId: this.GLOBAL_USER_ID },
    });

    if (!favorites) {
      throw new NotFoundException('Track is not in favorites');
    }

    const result = await this.prisma.favoriteTrack.deleteMany({
      where: {
        favoritesId: favorites.id,
        trackId: trackId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    // Verify album exists
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${albumId} doesn't exist`,
      );
    }

    // Get or create global favorites record
    const favorites = await this.getOrCreateGlobalFavorites();

    // Check if already in favorites
    const existingFavorite = await this.prisma.favoriteAlbum.findUnique({
      where: {
        favoritesId_albumId: {
          favoritesId: favorites.id,
          albumId: albumId,
        },
      },
    });

    if (!existingFavorite) {
      await this.prisma.favoriteAlbum.create({
        data: {
          favoritesId: favorites.id,
          albumId: albumId,
        },
      });
    }
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { userId: this.GLOBAL_USER_ID },
    });

    if (!favorites) {
      throw new NotFoundException('Album is not in favorites');
    }

    const result = await this.prisma.favoriteAlbum.deleteMany({
      where: {
        favoritesId: favorites.id,
        albumId: albumId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    // Verify artist exists
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${artistId} doesn't exist`,
      );
    }

    // Get or create global favorites record
    const favorites = await this.getOrCreateGlobalFavorites();

    // Check if already in favorites
    const existingFavorite = await this.prisma.favoriteArtist.findUnique({
      where: {
        favoritesId_artistId: {
          favoritesId: favorites.id,
          artistId: artistId,
        },
      },
    });

    if (!existingFavorite) {
      await this.prisma.favoriteArtist.create({
        data: {
          favoritesId: favorites.id,
          artistId: artistId,
        },
      });
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { userId: this.GLOBAL_USER_ID },
    });

    if (!favorites) {
      throw new NotFoundException('Artist is not in favorites');
    }

    const result = await this.prisma.favoriteArtist.deleteMany({
      where: {
        favoritesId: favorites.id,
        artistId: artistId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  // Helper method to ensure the global user exists
  private async ensureGlobalUserExists() {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: this.GLOBAL_USER_ID },
    });

    if (!existingUser) {
      await this.prisma.user.create({
        data: {
          id: this.GLOBAL_USER_ID,
          login: 'global-favorites',
          password: 'not-used', // This user is not meant for actual login
        },
      });
    }
  }

  // Helper method to get or create the global favorites record
  private async getOrCreateGlobalFavorites() {
    // Ensure user exists first
    await this.ensureGlobalUserExists();

    let favorites = await this.prisma.favorites.findUnique({
      where: { userId: this.GLOBAL_USER_ID },
    });

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: { userId: this.GLOBAL_USER_ID },
      });
    }

    return favorites;
  }
}
