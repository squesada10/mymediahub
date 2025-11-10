import { describe, test, expect } from 'vitest';
import { filterWatchlist } from '@/lib/filter-utils'; // Adjust the path if necessary
import type { MediaItem, StatusFilter, TypeFilter } from '@/app/watchlist/types'; // Adjust the path if necessary
import type { MediaStatus } from "@/lib/status-utils";

// --- Mock Data ---
const mockList: MediaItem[] = [
  { id: '1', title: 'Action Movie', type: 'movie', status: 'watched' as MediaStatus, genres: ['Action', 'Thriller'], year: 2020, overview: 'A thrilling story.', poster: undefined, runtimeMinutes: 120 },
  { id: '2', title: 'Drama Series', type: 'series', status: 'watching' as MediaStatus, genres: ['Drama'], year: 2021, overview: 'A family drama.', poster: undefined, episodesWatched: 5 },
  { id: '3', title: 'Comedy Movie', type: 'movie', status: 'to-watch' as MediaStatus, genres: ['Comedy', 'Family'], year: 2020, overview: 'A light comedy.', poster: undefined, runtimeMinutes: 90 },
  { id: '4', title: 'Sci-Fi Series', type: 'series', status: 'watched' as MediaStatus, genres: ['Sci-Fi', 'Mystery'], year: 2022, overview: 'Mysteries in space.', poster: undefined, episodesWatched: 10 },
];

// Helper function to create standard filter arguments for clean tests
const createFilterArgs = (overrides: Partial<{
  list: MediaItem[];
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  genreFilter: string | null;
  queryFilter: string | null;
}> = {}) => ({
  list: mockList,
  statusFilter: 'all' as StatusFilter,
  typeFilter: 'all' as TypeFilter,
  genreFilter: null,
  queryFilter: null,
  ...overrides,
});

describe('filterWatchlist (Utility Function)', () => {

  // --- Base Case ---
  test('should return the full list when all filters are disabled (null or "all")', () => {
    const args = createFilterArgs();
    const result = filterWatchlist(args);
    expect(result.length).toEqual(mockList.length);
  });

  // // --- Status Filtering ---
  // test('should filter the list to include only items marked "watched"', () => {
  //   const args = createFilterArgs({ statusFilter: 'watched' });
  //   const result = filterWatchlist(args);
  //   // We expect items with id '1' and '4'
  //   expect(result.map(item => item.id)).toEqual(['1', '4']);
  // });
  //
  // test.todo('should filter the list to include only items marked "watching"');
  //
  // // --- Type Filtering ---
  // test.todo('should filter the list to include only "movie" items');
  // test.todo('should filter the list to include only "series" items');
  //
  // // --- Genre Filtering ---
  // test.todo('should filter by a single genre name (e.g., "Action")');
  // test.todo('should filter genre case-insensitively (e.g., "comedy")');
  // test.todo('should return an empty list if no items match the genre');
  //
  // // --- Query Filtering ---
  // test.todo('should filter items where the query matches the title');
  // test.todo('should filter items where the query matches the overview');
  // test.todo('should filter query case-insensitively');
  //
  // // --- Combined Filtering ---
  // test.todo('should correctly apply a combination of status, type, and genre filters');
  // test.todo('should correctly apply a combination of status and query filters');
});
