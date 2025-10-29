'use client';
import React from "react";
import type { MediaStatus } from '../mockWatchlist'

type Props = {
  filter: MediaStatus | 'all';
  setFilter: (f: MediaStatus | 'all') => void;
};

export default function WatchlistFilter({ filter, setFilter }: Props) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as MediaStatus | 'all')}
        className="border rounded px-3 py-2 text-sm"
        aria-label="Filter watchlist by status"
      >
        <option value="all">All</option>
        <option value="to-watch">To Watch</option>
        <option value="watching">Watching</option>
        <option value="watched">Watched</option>
      </select>
    </div>
  );
}
