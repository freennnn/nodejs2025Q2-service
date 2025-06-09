import { Artist, Album, Track } from '../../generated/prisma';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
