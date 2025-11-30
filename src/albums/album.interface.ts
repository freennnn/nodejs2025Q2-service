export interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // uuid v4 or null
}
