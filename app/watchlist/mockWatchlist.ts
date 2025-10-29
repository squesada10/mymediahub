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
    title: 'Alien',
    year: 2023,
    type: 'movie',
    poster: '/placeholders/movie-1.jpg',
    overview: 'An horror journey across unknown galaxy.',
    status: 'to-watch',
    runtimeMinutes: 125,
  },
  {
    id: 's-1',
    title: 'Breaking Bad',
    year: 2021,
    type: 'series',
    poster: '/placeholders/series-1.jpg',
    overview: 'A drama about a desperate man.',
    status: 'watching',
    episodesWatched: 3,
  },
  {
    id: 'm-2',
    title: 'Whiplash',
    year: 2019,
    type: 'movie',
    poster: '/placeholders/movie-2.jpg',
    overview: 'A story of an obsesion',
    status: 'watched',
    runtimeMinutes: 97,
  },
];
