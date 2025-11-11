import { useMemo, useState, useEffect, useCallback, SetStateAction } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalStorage } from "./useLocalStorage";
import { MOCK_WATCHLIST } from "@/app/watchlist/mockWatchlist";
import { ALL_AVAILABLE_GENRES } from "@/lib/tmdb-constants";
import { filterWatchlist } from "@/lib/filter-utils";
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
  genres: string[]; // All unique genres found
  genreFilter: string | null; // The currently active genre
  queryFilter: string | null;
  setGenreFilter: (genre: string | null) => void;

  // Actions
  setFilter: (f: 'all' | MediaStatus) => void;
  setSelected: (item: MediaItem | null | SetStateAction<MediaItem | null>) => void;
  setQueryFilter: (newQuery: string | null) => void;
  handleToggleStatus: (id: string) => void;
  setStatus: (id: string, newStatus: MediaStatus) => void;
  handleAddItem: (itemToAdd: MediaItem) => void;
  setShowAddModal: (show: boolean) => void;
  setPendingDeletion: (item: PendingDeletion) => void;
  confirmDeleteItem: () => void;
  requestDeleteItem: (id: string) => void;
  // Update item partial fields (eg. runtimeMinutes)
  updateItem: (id: string, updates: Partial<MediaItem>) => void;
};

// Helper function (moved from page.tsx)
function toggle(status?: string) {
  if (status === 'to-watch') return 'watching' as MediaStatus;
  if (status === 'watching') return 'watched' as MediaStatus;
  if (status === 'watched') return 'to-watch' as MediaStatus;
  return 'to-watch' as MediaStatus;
}

export function useWatchlist(): UseWatchlistResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion>(null);

  const statusFilter = (searchParams.get('status') as MediaStatus | null) || 'all';
  const typeFilter = searchParams.get('type') as 'movie' | 'series' | null;
  const genreFilter = searchParams.get('genre');
  const queryFilter = searchParams.get('query');

  // 2. Side Effect (from page.tsx)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Data Extraction
  // Extract and sort all unique genres

  const allGenres = useMemo(() => {
    return ALL_AVAILABLE_GENRES;
  }, []);

  // 3. Filtering Logic (from page.tsx)
  const list = useMemo(() => {
    return filterWatchlist({
      list: stored,
      statusFilter,
      typeFilter,
      genreFilter,
      queryFilter
    });
  }, [stored, statusFilter, typeFilter, genreFilter, queryFilter]);

  // 4. Handlers (from page.tsx)
  const setFilter = useCallback((newStatus: 'all' | MediaStatus) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (newStatus === 'all') {
      currentParams.delete('status');
    } else {
      currentParams.set('status', newStatus);
    }
    // Push new URL without navigating away from the watchlist page
    router.push(`/watchlist?${currentParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const setGenreFilter = useCallback((newGenre: string | null) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    const genreValue = newGenre;

    if (!genreValue || genreValue === 'all') {
      currentParams.delete('genre');
    } else {
      currentParams.set('genre', genreValue);
    }
    router.push(`/watchlist?${currentParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const setQueryFilter = useCallback((newQuery: string | null) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (!newQuery || newQuery.trim() === '') {
      currentParams.delete('query');
    } else {
      currentParams.set('query', newQuery);
    }
    router.push(`/watchlist?${currentParams.toString()}`, { scroll: false });
  }, [router, searchParams]);


  const handleUpdateStatus = useCallback((id: string, newStatus: MediaItem['status'] | 'toggle') => {
    setStored((prev) => prev.map((item) => {
      if (item.id !== id) {
        return item;
      }
      // Apply toggle logic if requested
      const finalStatus = newStatus === 'toggle' ? toggle(item.status) : newStatus;

      // This is the clean status update logic
      return { ...item, status: finalStatus };
    }));
  }, [setStored]);

  const handleToggleStatus = useCallback((id: string) => handleUpdateStatus(id, 'toggle'), [handleUpdateStatus]);
  const setStatus = handleUpdateStatus;
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

  const updateItem = useCallback((id: string, updates: Partial<MediaItem>) => {
  setStored((prev) => prev.map((item) => item.id === id ? ({ ...(item as unknown as Record<string, unknown>), ...updates } as MediaItem) : item));
    // Also update selected if it matches
  setSelected((prev) => prev && prev.id === id ? ({ ...(prev as unknown as Record<string, unknown>), ...updates } as MediaItem) : prev);
  }, [setStored]);

  // Handler to trigger the dialog (called by the cards/modal)
  const requestDeleteItem = useCallback((id: string) => {
    const item = stored.find(i => i.id === id);
    if (item) {
      setPendingDeletion({ id: item.id, title: item.title });
    }
  }, [stored]);

  return {
    list,
    filter: statusFilter,
    genres: allGenres,
    selected,
    isMounted,
    showAddModal,
    pendingDeletion,
    genreFilter,
    queryFilter,
    setFilter,
    setGenreFilter,
    setQueryFilter,
    setSelected,
    handleToggleStatus,
    setStatus,
    handleAddItem,
  updateItem,
    setShowAddModal,
    confirmDeleteItem,
    requestDeleteItem,
    setPendingDeletion
  };
}
