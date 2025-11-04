'use client';

import { useMemo, useState, useEffect } from "react";
import { MOCK_WATCHLIST, type MediaItem } from "./mockWatchlist";
import WatchlistCard from "./components/WatchlistCard";
import WatchlistFilter from "./components/WatchlistFilter";
import WatchlistModal from "./components/WatchlistModal";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function WatchlistPage() {
  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [filter, setFilter] = useState<'all' | 'to-watch' | 'watching' | 'watched'>('all');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  function handleAddItem(itemToAdd: MediaItem) {
    // No need for manual ID generation or default status/year anymore, 
    // as SearchMediaForm handles the formatting.
    setStored((prev) => [itemToAdd, ...prev]);
    setShowAddModal(false);
  }

  function handleDeleteItem(id: string) {
    if (confirm("Are you sure you want to delete this item?")) {
      setStored((prev) => prev.filter((p) => p.id !== id));
      setSelected(null); // Close the modal after deletion
    }
  }

  if (!isMounted) {
    // 💤 Render skeleton or nothing until mounted
    return <main className="p-6 text-center text-muted-foreground">Loading watchlist...</main>;
  }

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">🎬 My Watchlist</h1>
            <p className="text-muted-foreground text-sm">
              Track what you’re watching and what’s next.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <WatchlistFilter filter={filter} setFilter={setFilter} />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition">
              + Add
            </button>
          </div>
        </header>

        {/* ===== Watchlist Grid ===== */}
        <section>
          {list.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No items found for this filter.
            </div>
          ) : (
            <div
              className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
            >
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
        {selected && (
          <WatchlistModal
            item={selected}
            onClose={() => setSelected(null)}
            onChangeStatus={(id, status) => {
              setStatus(id, status);
              setSelected((s) => (s && s.id === id ? { ...s, status } : s));
            }}
            onDeleteItem={handleDeleteItem}
          />
        )}
        {showAddModal && (
          <WatchlistModal
            item={null} // Triggers the 'Add' mode in the modal
            onClose={() => setShowAddModal(false)}
            onChangeStatus={() => { }}
            onAddSearchItem={handleAddItem}
            onDeleteItem={undefined}
          />
        )}
      </div>
    </main>
  );
}
