export type MediaStatus = 'to-watch' | 'watching' | 'watched';

export interface MediaItem {
  id: string;
  title: string;
  year?: number;
  type: 'movie' | 'series';
  poster?: string;
  overview: string;
  status?: MediaStatus;
  episodesWatched?: number;
  runtimeMinutes?: number;
}

export const MOCK_WATCHLIST: MediaItem[] = [
  {
    id: 'm-1',
    title: 'The Grand Adventure',
    year: 2023,
    type: 'movie',
    poster: '/placeholders/movie-1.jpg',
    overview: 'An epic journey across unknown lands.',
    status: 'to-watch',
    runtimeMinutes: 125,
  },
  {
    id: 's-1',
    title: 'Space Station 12',
    year: 2021,
    type: 'series',
    poster: '/placeholders/series-1.jpg',
    overview: 'A sci-fi drama aboard a long-lived orbital station.',
    status: 'watching',
    episodesWatched: 3,
  },
  {
    id: 'm-2',
    title: 'Indie Gem',
    year: 2019,
    type: 'movie',
    poster: '/placeholders/movie-2.jpg',
    overview: 'A small story with a big heart.',
    status: 'watched',
    runtimeMinutes: 97,
  },
];
