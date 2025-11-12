/**
 * Media type guards and utilities
 * Provides type-safe checks and conversions for media types
 */

import type { MediaItem, MovieItem } from '@/app/watchlist/types';

export type MediaType = 'movie' | 'series';

/**
 * Check if an item is a movie
 * @param item - Media item to check
 * @returns True if item is a movie
 */
export function isMovie(item: MediaItem): item is MovieItem {
  return item.type === 'movie';
}

/**
 * Check if an item is a series
 * @param item - Media item to check
 * @returns True if item is a series
 */
export function isSeries(item: MediaItem): boolean {
  return item.type === 'series';
}

/**
 * Get display name for media type
 * @param type - Media type
 * @returns Capitalized display name
 */
export function getMediaTypeLabel(type: MediaType): string {
  return type === 'movie' ? 'Movie' : 'Series';
}

/**
 * Check if a string is a numeric ID (typically from TMDB)
 * @param id - The ID string to check
 * @returns True if ID consists only of digits
 */
export function isNumericId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

/**
 * Type guard for MovieItem
 * Ensures we can safely access movie-specific properties
 * @param item - Media item to narrow
 * @returns Type predicate for TypeScript
 */
export function assertIsMovie(item: MediaItem): asserts item is MovieItem {
  if (!isMovie(item)) {
    throw new Error(`Expected movie but got ${item.type}`);
  }
}
