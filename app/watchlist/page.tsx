'use client';

import { useWatchlist } from "@/lib/useWatchlist";
import type { MediaItem } from "./types";
import WatchlistCard from "./components/WatchlistCard";
import WatchlistFilter from "./components/WatchlistFilter";
import WatchlistModal from "./components/WatchlistModal";
import ConfirmDialog from "./components/ConfirmDialog"
import GenreFilter from "@/app/components/GenreFilter";

export default function WatchlistPage() {
  const {
    list,
    filter,
    selected,
    isMounted,
    showAddModal,
    pendingDeletion,
    genres,
    genreFilter,
    setFilter,
    setSelected,
    handleToggleStatus,
    setStatus,
    handleAddItem,
    setShowAddModal,
    requestDeleteItem,
    confirmDeleteItem,
    setPendingDeletion,
    setGenreFilter,
    updateItem,
  } = useWatchlist();

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

            <GenreFilter
              genres={genres}
              currentGenre={genreFilter}
              setGenre={setGenreFilter}
            />

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600">
              + Add to Watchlist
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
                  onDeleteItem={requestDeleteItem}
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
              setSelected((prevSelected: MediaItem | null) => {
                if (prevSelected && prevSelected.id === id) {
                  return { ...prevSelected, status: status };
                }
                return prevSelected;
              });
            }}
            onDeleteItem={requestDeleteItem}
            onUpdateItem={updateItem}
          />
        )}
        {showAddModal && (
          <WatchlistModal
            item={null}
            onClose={() => setShowAddModal(false)}
            onChangeStatus={() => { }}
            onAddSearchItem={handleAddItem}
            onDeleteItem={undefined}
          />
        )}
        {pendingDeletion && (
          <ConfirmDialog
            title="Confirm Deletion"
            message={`Are you sure you want to permanently delete "${pendingDeletion.title}" from your watchlist? This action cannot be undone.`}
            onConfirm={confirmDeleteItem}
            onCancel={() => setPendingDeletion(null)}
          />
        )}
      </div>
    </main>
  );
}
