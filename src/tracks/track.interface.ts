export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // uuid v4 or null
  albumId: string | null; // uuid v4 or null
  duration: number; // integer, seconds
}
