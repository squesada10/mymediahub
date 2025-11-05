'use client';

import { useState } from "react";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL } from "@/lib/api-constants";
import type { TmdbSearchResult } from "@/app/api/search/route";
import type { MediaItem } from "../mockWatchlist";
import SearchSkeleton from "./SearchSkeleton";

// Props for the Search Form
type SearchProps = {
  // onAdd now takes the complete, formatted item ready for the watchlist
  onAdd: (item: MediaItem) => void;
  onClose: () => void;
};

export default function SearchMediaForm({ onAdd, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Call our Next.js API route
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error('Search failed. Please try again.');
      }

      const data: TmdbSearchResult[] = await res.json();
      setResults(data);

    } catch (err) {
      let errorMessage = 'An unknown search error ocurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the TMDB result into my local MediaItem type
  const formatAndAddItem = (result: TmdbSearchResult) => {
    const item: MediaItem = {
      // TMDB IDs are numbers, convert to string for consistency with my existing 'id: string' type
      id: String(result.id),
      title: result.title,
      year: result.release_date ? new Date(result.release_date).getFullYear() : undefined,
      type: result.media_type === 'movie' ? 'movie' : 'series',
      poster: result.poster_path ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}` : undefined,
      overview: result.overview,
      status: 'to-watch', // Always defaults to 'to-watch' upon adding
    };
    onAdd(item);
    onClose();
    // Clear search state after successful add
    setQuery('');
    setResults([]);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Search & Add Media</h2>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or series..."
          className="flex-grow rounded-lg border border-gray-300 p-2 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50 hover:bg-primary/80 transition">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <SearchSkeleton />
      ) : (
        <>
          {/* Display Results */}
          {results.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {results.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md items-center">
                  {item.poster_path ? (
                    <Image
                      src={`${TMDB_IMAGE_BASE_URL}${item.poster_path}`}
                      alt={item.title}
                      width={40}
                      height={60}
                      className="rounded object-cover flex-shrink-0 w-10 h-16"
                    />
                  ) : (
                    <div className="w-10 h-16 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0"></div>
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold text-base leading-tight">{item.title}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.media_type === 'movie' ? 'Movie' : 'Series'}
                      {item.release_date && item.release_date !== 'N/A' &&
                        ` (${new Date(item.release_date).getFullYear()})`}
                    </span>
                  </div>
                  <button
                    onClick={() => formatAndAddItem(item)}
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition flex-shrink-0" >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state for search results */}
          {!loading && query && results.length === 0 && !error && (
            <p className="text-center text-gray-500 py-4">No results found for `{query}`.</p>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition" >
          Cancel
        </button>
      </div>
    </div>
  );
}
