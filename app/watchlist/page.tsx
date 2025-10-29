'use client';

import React, { useMemo, useState } from "react";
import { MOCK_WATCHLIST, type MediaItem } from "./mockWatchlist";
import WatchlistCard from "./components/WatchlistCard";
import WatchlistFilter from "./components/WatchlistFilter";
import WatchlistModal from "./components/WatchlistModal";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function WatchlistPage() {
  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [filter, setFilter] = useState<'all' | 'to-watch' | 'watching' | 'watched'>('all');
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const list = useMemo(() => {
    if (filter === 'all') return stored;
    return stored.filter((s) => s.status === filter);
  }, [stored, filter]);

  function handleToggleStatus(id: string) {
    setStored((prev) => prev.map((p) => (p.id === id ? { ...p, status: toggle(p.status) } : p)));
  }

  function toggle(status?: string) {
    if (status === 'to-watch') return 'watching';
    if (status === 'watching') return 'watched';
    return 'to-watch';
  }

  function setStatus(id: string, newStatus: MediaItem['status']) {
    setStored((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  }

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Watchlist Manager</h1>
          <WatchlistFilter filter={filter} setFilter={setFilter} />
        </header>

        <section>
          {list.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No items found for this filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {list.map((item) => (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  onOpen={(it) => setSelected(it)}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </section>

        <WatchlistModal
          item={selected}
          onClose={() => setSelected(null)}
          onChangeStatus={(id, status) => {
            setStatus(id, status);
            setSelected((s) => (s && s.id === id ? { ...s, status } : s));
          }}
        />
      </div>
    </main>
  );
} 
