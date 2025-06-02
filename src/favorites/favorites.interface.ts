import { Artist } from '../artists/artist.interface';
import { Album } from '../albums/album.interface';
import { Track } from '../tracks/track.interface';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface Favorites {
  artists: string[]; // array of artist IDs
  albums: string[]; // array of album IDs
  tracks: string[]; // array of track IDs
}
