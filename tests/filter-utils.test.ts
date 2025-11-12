import { describe, test, expect } from 'vitest';
import { filterWatchlist } from '@/lib/filter-utils'; // Adjust the path if necessary
import type { MediaItem, StatusFilter, TypeFilter } from '@/app/watchlist/types'; // Adjust the path if necessary
import type { MediaStatus } from "@/lib/status-constants";

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
  statusFilter: StatusFilter | null;
  typeFilter: TypeFilter | null;
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
  test('should return the full list when all filters are disabled (all or null)', () => {
    const args = createFilterArgs();
    const result = filterWatchlist(args);
    expect(result.length).toEqual(mockList.length);
    expect(result).toEqual(mockList);
  });

  // --- Status Filtering ---
  test('should filter the list to include only items marked "watched"', () => {
    const args = createFilterArgs({ statusFilter: 'watched' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(2);
    expect(result.map(item => item.id)).toEqual(['1', '4']);
    expect(result.every(item => item.status === 'watched')).toBe(true);
  });

  test('should filter the list to include only items marked "watching"', () => {
    const args = createFilterArgs({ statusFilter: 'watching' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('2');
    expect(result[0].status).toEqual('watching');
  });

  test('should filter the list to include only items marked "to-watch"', () => {
    const args = createFilterArgs({ statusFilter: 'to-watch' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('3');
    expect(result[0].status).toEqual('to-watch');
  });

  // --- Type Filtering ---
  test('should filter the list to include only "movie" items', () => {
    const args = createFilterArgs({ typeFilter: 'movie' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(2);
    expect(result.map(item => item.id)).toEqual(['1', '3']);
    expect(result.every(item => item.type === 'movie')).toBe(true);
  });

  test('should filter the list to include only "series" items', () => {
    const args = createFilterArgs({ typeFilter: 'series' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(2);
    expect(result.map(item => item.id)).toEqual(['2', '4']);
    expect(result.every(item => item.type === 'series')).toBe(true);
  });

  // --- Genre Filtering ---
  test('should filter by a single genre name (e.g., "Action")', () => {
    const args = createFilterArgs({ genreFilter: 'Action' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
    expect(result[0].genres).toContain('Action');
  });

  test('should filter by genre "Drama"', () => {
    const args = createFilterArgs({ genreFilter: 'Drama' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('2');
  });

  test('should filter by genre "Comedy"', () => {
    const args = createFilterArgs({ genreFilter: 'Comedy' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('3');
  });

  test('should filter genre case-insensitively (lowercase "comedy" matches "Comedy")', () => {
    const args = createFilterArgs({ genreFilter: 'comedy' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('3');
  });

  test('should filter genre case-insensitively (uppercase "ACTION" matches "Action")', () => {
    const args = createFilterArgs({ genreFilter: 'ACTION' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should filter genre with extra whitespace (e.g., "  action  ")', () => {
    const args = createFilterArgs({ genreFilter: '  action  ' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should return an empty list if no items match the genre', () => {
    const args = createFilterArgs({ genreFilter: 'NonExistentGenre' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(0);
    expect(result).toEqual([]);
  });

  test('should handle multiple items with the same genre', () => {
    const args = createFilterArgs({ genreFilter: 'Sci-Fi' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('4');
  });

  // --- Query Filtering ---
  test('should filter items where the query matches the title exactly', () => {
    const args = createFilterArgs({ queryFilter: 'Action Movie' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should filter items where the query partially matches the title', () => {
    const args = createFilterArgs({ queryFilter: 'Movie' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(2);
    expect(result.map(item => item.id)).toEqual(['1', '3']);
  });

  test('should filter items where the query matches the overview', () => {
    const args = createFilterArgs({ queryFilter: 'thrilling' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should filter items where the query matches the overview (partial match)', () => {
    const args = createFilterArgs({ queryFilter: 'drama' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('2');
  });

  test('should filter query case-insensitively (uppercase "ACTION" matches lowercase overview)', () => {
    const args = createFilterArgs({ queryFilter: 'ACTION' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should filter query case-insensitively (lowercase "STORY" matches overview)', () => {
    const args = createFilterArgs({ queryFilter: 'STORY' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should return empty list if query matches nothing in title or overview', () => {
    const args = createFilterArgs({ queryFilter: 'NonExistentQuery' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(0);
  });

  test('should handle query with extra whitespace', () => {
    const args = createFilterArgs({ queryFilter: '  light comedy  ' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1); // "light comedy" is in item 3's overview
    expect(result[0].id).toEqual('3');
  });

  test('should find query when it\'s a substring in title with spaces', () => {
    const args = createFilterArgs({ queryFilter: 'Light' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('3');
  });

  // --- Combined Filtering ---
  test('should correctly apply both status and type filters', () => {
    const args = createFilterArgs({ statusFilter: 'watched', typeFilter: 'movie' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
    expect(result[0].status).toEqual('watched');
    expect(result[0].type).toEqual('movie');
  });

  test('should correctly apply status, type, and genre filters together', () => {
    const args = createFilterArgs({
      statusFilter: 'watched',
      typeFilter: 'series',
      genreFilter: 'Sci-Fi',
    });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('4');
    expect(result[0].status).toEqual('watched');
    expect(result[0].type).toEqual('series');
    expect(result[0].genres).toContain('Sci-Fi');
  });

  test('should correctly apply status and query filters together', () => {
    const args = createFilterArgs({
      statusFilter: 'watched',
      queryFilter: 'story',
    });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should return empty when combined filters match nothing', () => {
    const args = createFilterArgs({
      statusFilter: 'to-watch',
      typeFilter: 'series',
    });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(0);
  });

  test('should apply all four filters (status, type, genre, query)', () => {
    const args = createFilterArgs({
      statusFilter: 'watched',
      typeFilter: 'movie',
      genreFilter: 'Action',
      queryFilter: 'thrilling',
    });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('1');
  });

  test('should handle filter with "all" string for type (should not filter)', () => {
    const args = createFilterArgs({ typeFilter: 'all' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(mockList.length);
  });

  test('should handle filter with "all" string for status (should not filter)', () => {
    const args = createFilterArgs({ statusFilter: 'all' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(mockList.length);
  });

  test('should handle filter with "all" string for genre (should not filter)', () => {
    const args = createFilterArgs({ genreFilter: 'all' });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(mockList.length);
  });

  // --- Edge Cases ---
  test('should handle empty list input', () => {
    const args = createFilterArgs({ list: [] });
    const result = filterWatchlist(args);
    expect(result.length).toEqual(0);
    expect(result).toEqual([]);
  });

  test('should preserve original order when filtering', () => {
    const args = createFilterArgs({ statusFilter: 'watched' });
    const result = filterWatchlist(args);
    // Items 1 and 4 are watched; should maintain original order from mockList
    expect(result[0].id).toEqual('1');
    expect(result[1].id).toEqual('4');
  });

  test('should not mutate the original list', () => {
    const listCopy = JSON.parse(JSON.stringify(mockList));
    const args = createFilterArgs({ statusFilter: 'watched' });
    filterWatchlist(args);
    expect(mockList).toEqual(listCopy);
  });

});
