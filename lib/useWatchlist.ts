import { useMemo, useState, useEffect, useCallback, SetStateAction } from "react";
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from "./useLocalStorage";
import { MOCK_WATCHLIST } from "@/app/watchlist/mockWatchlist";
import type { MediaItem } from "@/app/watchlist/types";
import type { MediaStatus } from "@/lib/status-utils";

type PendingDeletion = { id: string, title: string } | null;

export type MediaTypeFilter = 'all' | 'movie' | 'series' | MediaStatus;

export type UseWatchlistResult = {
  // Data
  list: MediaItem[];
  filter: 'all' | MediaStatus;
  selected: MediaItem | null;
  isMounted: boolean;
  showAddModal: boolean;
  pendingDeletion: PendingDeletion;

  // Actions
  setFilter: (f: 'all' | MediaStatus) => void;
  setSelected: (item: MediaItem | null | SetStateAction<MediaItem | null>) => void;
  handleToggleStatus: (id: string) => void;
  setStatus: (id: string, newStatus: MediaStatus) => void;
  handleAddItem: (itemToAdd: MediaItem) => void;
  setShowAddModal: (show: boolean) => void;
  setPendingDeletion: (item: PendingDeletion) => void;
  confirmDeleteItem: () => void;
  requestDeleteItem: (id: string) => void;
};


// Helper function (moved from page.tsx)
function toggle(status?: string) {
  if (status === 'to-watch') return 'watching' as MediaStatus;
  if (status === 'watching') return 'watched' as MediaStatus;
  if (status === 'watched') return 'to-watch' as MediaStatus;
  return 'to-watch' as MediaStatus;
}


export function useWatchlist(): UseWatchlistResult {

  const searchParams = useSearchParams();

  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [filter, setFilter] = useState<'all' | MediaStatus>('all');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion>(null);

  // 2. Side Effect (from page.tsx)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const typeFilter = searchParams.get('type') as 'movie' | 'series' | null;

  // 3. Filtering Logic (from page.tsx)
  const list = useMemo(() => {
    let filteredList = stored;

    // Apply Status Filter first ('watched', 'watching', 'to-watch')
    if (filter !== 'all') {
      filteredList = filteredList.filter((s) => s.status === filter);
    }

    // 💡 Apply Type Filter (from URL) second
    if (typeFilter) {
      filteredList = filteredList.filter((s) => s.type === typeFilter);
    }

    return filteredList;
  }, [stored, filter, typeFilter]);

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

  const confirmDeleteItem = useCallback(() => {
    if (!pendingDeletion) return;

    const idToDelete = pendingDeletion.id;

    setStored((prev) => prev.filter((p) => p.id !== idToDelete));
    setSelected(null);
    // Clear the pending state
    setPendingDeletion(null);
  }, [pendingDeletion, setStored]);

  // Handler to trigger the dialog (called by the cards/modal)
  const requestDeleteItem = useCallback((id: string) => {
    const item = stored.find(i => i.id === id);
    if (item) {
      setPendingDeletion({ id: item.id, title: item.title });
    }
  }, [stored]);



  return {
    list,
    filter,
    selected,
    isMounted,
    showAddModal,
    pendingDeletion,
    setFilter,
    setSelected,
    handleToggleStatus,
    setStatus,
    handleAddItem,
    setShowAddModal,
    confirmDeleteItem,
    requestDeleteItem,
    setPendingDeletion
  };
}
