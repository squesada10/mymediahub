import { useMemo, useState, useEffect, useCallback, SetStateAction } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { MOCK_WATCHLIST } from "@/app/watchlist/mockWatchlist";
import type { MediaItem } from "@/app/watchlist/types";
import type { MediaStatus } from "@/lib/status-utils"
// Define the return type for the hook
export type UseWatchlistResult = {
  // Data
  list: MediaItem[];
  filter: 'all' | MediaStatus;
  selected: MediaItem | null;
  isMounted: boolean;
  showAddModal: boolean;

  // Actions
  setFilter: (f: 'all' | MediaStatus) => void;
  setSelected: (item: MediaItem | null | SetStateAction<MediaItem | null>) => void;
  handleToggleStatus: (id: string) => void;
  setStatus: (id: string, newStatus: MediaStatus) => void;
  handleAddItem: (itemToAdd: MediaItem) => void;
  handleDeleteItem: (id: string) => void;
  setShowAddModal: (show: boolean) => void;
};


// Helper function (moved from page.tsx)
function toggle(status?: string) {
  if (status === 'to-watch') return 'watching' as MediaStatus;
  if (status === 'watching') return 'watched' as MediaStatus;
  if (status === 'watched') return 'to-watch' as MediaStatus;
  return 'to-watch' as MediaStatus;
}


export function useWatchlist(): UseWatchlistResult {
  // 1. State Management (from page.tsx)
  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [filter, setFilter] = useState<'all' | MediaStatus>('all');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 2. Side Effect (from page.tsx)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Filtering Logic (from page.tsx)
  const list = useMemo(() => {
    if (filter === 'all') return stored;
    return stored.filter((s) => s.status === filter);
  }, [stored, filter]);

  // 4. Handlers (from page.tsx)
  const handleToggleStatus = useCallback((id: string) => {
    setStored((prev) => prev.map((p) => (p.id === id ? { ...p, status: toggle(p.status) } : p)));
  }, [setStored]);

  const setStatus = useCallback((id: string, newStatus: MediaStatus) => {
    setStored((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  }, [setStored]);

  const handleAddItem = useCallback((itemToAdd: MediaItem) => {
    setStored((prev) => [itemToAdd, ...prev]);
    setShowAddModal(false);
  }, [setStored]);

  const handleDeleteItem = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setStored((prev) => prev.filter((p) => p.id !== id));
      setSelected(null);
    }
  }, [setStored]);


  return {
    list,
    filter,
    selected,
    isMounted,
    showAddModal,
    setFilter,
    setSelected,
    handleToggleStatus,
    setStatus,
    handleAddItem,
    handleDeleteItem,
    setShowAddModal
  };
}
