export type MediaStatus = 'to-watch' | 'watching' | 'watched';
export type MediaItem = MovieItem | SeriesItem;

// 1. Define Base Properties for all media types
interface BaseMedia {
  id: string;
  title: string;
  year?: number;
  poster?: string;
  overview: string;
  status: MediaStatus;
}

// 2. Define the Movie specific properties
export interface MovieItem extends BaseMedia {
  type: 'movie';
  runtimeMinutes: number;
}

// 3. Define the Series specific properties
export interface SeriesItem extends BaseMedia {
  type: 'series';
  episodesWatched: number;
  // You might also add totalSeasons or totalEpisodes later
}

