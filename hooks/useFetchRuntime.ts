/**
 * Custom hook for fetching movie runtime from TMDB API
 * Handles loading, error states, and automatic persistence
 */

import { useEffect, useState, useCallback } from 'react';
import type { MediaItem } from '@/app/watchlist/types';
import { isMovie, isNumericId } from '@/lib/media-utils';

interface UseFetchRuntimeResult {
  runtime: number | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFetchRuntimeOptions {
  /**
   * Callback when runtime is successfully fetched
   * Used to persist the runtime back to storage
   */
  onRuntimeFetched?: (runtime: number) => void;
}

/**
 * Extract runtime value from API response
 * @param data - API response object
 * @returns Runtime in minutes, or 0 if not found
 */
function extractRuntimeFromResponse(data: Record<string, unknown> | null): number {
  if (!data) return 0;
  const runtime = data['runtimeMinutes'];
  return typeof runtime === 'number' ? runtime : 0;
}

/**
 * Extract and format error message from API response
 * @param data - API response object
 * @param status - HTTP status code
 * @returns Formatted error message
 */
function extractErrorMessage(data: Record<string, unknown> | null, status: number): string {
  if (data && typeof data['error'] === 'string') {
    return data['error'];
  }
  return `TMDB error ${status}`;
}

/**
 * Fetch movie runtime from the API
 * Only attempts fetch for:
 * - Movie type items
 * - Numeric IDs (TMDB format)
 * - Items without existing runtime
 *
 * @param item - The media item
 * @param options - Additional options
 * @returns Object with runtime, loading state, and error message
 */
export function useFetchRuntime(
  item: MediaItem | null,
  options: UseFetchRuntimeOptions = {}
): UseFetchRuntimeResult {
  const [runtime, setRuntime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldFetch = useCallback((): boolean => {
    if (!item) return false;

    // Only fetch for movies
    if (!isMovie(item)) return false;

    // Skip if runtime already exists
    if (item.runtimeMinutes && item.runtimeMinutes > 0) {
      setRuntime(item.runtimeMinutes);
      return false;
    }

    // Only fetch numeric IDs (TMDB format)
    return isNumericId(item.id);
  }, [item]);

  const fetchRuntimeFromAPI = useCallback(async () => {
    if (!item) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movie/${encodeURIComponent(item.id)}`);
      let responseData: Record<string, unknown> | null = null;

      // Try to parse JSON response, but don't fail if it's not valid JSON
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      // Handle non-OK response
      if (!response.ok) {
        const errorMessage = extractErrorMessage(responseData, response.status);
        console.error('Runtime fetch error:', errorMessage);
        setError(errorMessage);
        return;
      }

      // Extract runtime from response
      const fetchedRuntime = extractRuntimeFromResponse(responseData);
      if (fetchedRuntime && fetchedRuntime > 0) {
        setRuntime(fetchedRuntime);
        options.onRuntimeFetched?.(fetchedRuntime);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not load duration';
      console.error('Runtime fetch unexpected error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [item, options]);

  useEffect(() => {
    if (!shouldFetch()) {
      return;
    }

    fetchRuntimeFromAPI();
  }, [shouldFetch, fetchRuntimeFromAPI]);

  return {
    runtime,
    isLoading,
    error,
  };
}
