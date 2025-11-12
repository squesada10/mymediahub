import { useMemo, useState, useEffect, useCallback, SetStateAction } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalStorage } from "./useLocalStorage";
import { MOCK_WATCHLIST } from "@/app/watchlist/mockWatchlist";
import { ALL_AVAILABLE_GENRES } from "@/lib/tmdb-constants";
import { filterWatchlist } from "@/lib/filter-utils";
import { getNextStatus, type MediaStatus } from "@/lib/status-constants";
import type { MediaItem } from "@/app/watchlist/types";

type PendingDeletion = { id: string; title: string } | null;

export type UseWatchlistResult = {
  // Data
  list: MediaItem[];
  filter: 'all' | MediaStatus;
  selected: MediaItem | null;
  isMounted: boolean;
  showAddModal: boolean;
  pendingDeletion: PendingDeletion;
  genres: string[];
  genreFilter: string | null;
  queryFilter: string | null;

  // Setters
  setGenreFilter: (genre: string | null) => void;
  setFilter: (f: 'all' | MediaStatus) => void;
  setSelected: (item: MediaItem | null | SetStateAction<MediaItem | null>) => void;
  setQueryFilter: (newQuery: string | null) => void;
  setShowAddModal: (show: boolean) => void;
  setPendingDeletion: (item: PendingDeletion) => void;

  // Mutations
  handleToggleStatus: (id: string) => void;
  setStatus: (id: string, newStatus: MediaStatus) => void;
  handleAddItem: (itemToAdd: MediaItem) => void;
  confirmDeleteItem: () => void;
  requestDeleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<MediaItem>) => void;
};

/**
 * Central hook for watchlist state management
 * Handles filtering, local storage persistence, and URL sync
 */
export function useWatchlist(): UseWatchlistResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===== STATE MANAGEMENT =====
  const [stored, setStored] = useLocalStorage<MediaItem[]>('watchlist_v1', MOCK_WATCHLIST);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion>(null);

  // ===== URL PARAMETERS =====
  const statusFilter = (searchParams.get('status') as MediaStatus | null) || 'all';
  const typeFilter = searchParams.get('type') as 'movie' | 'series' | null;
  const genreFilter = searchParams.get('genre');
  const queryFilter = searchParams.get('query');

  // ===== INITIALIZATION =====
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ===== COMPUTED DATA =====
  const allGenres = useMemo(() => ALL_AVAILABLE_GENRES, []);

  const list = useMemo(() => {
    return filterWatchlist({
      list: stored,
      statusFilter,
      typeFilter,
      genreFilter,
      queryFilter,
    });
  }, [stored, statusFilter, typeFilter, genreFilter, queryFilter]);

  // ===== URL SYNCING HELPERS =====
  /**
   * Update URL parameters without page navigation
   */
  const updateUrlParam = useCallback(
    (param: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === 'all') {
        params.delete(param);
      } else {
        params.set(param, value);
      }

      router.push(`/watchlist?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // ===== FILTER HANDLERS =====
  const setFilter = useCallback(
    (newStatus: 'all' | MediaStatus) => {
      updateUrlParam('status', newStatus === 'all' ? null : newStatus);
    },
    [updateUrlParam]
  );

  const setGenreFilter = useCallback(
    (newGenre: string | null) => {
      updateUrlParam('genre', newGenre);
    },
    [updateUrlParam]
  );

  const setQueryFilter = useCallback(
    (newQuery: string | null) => {
      updateUrlParam('query', newQuery && newQuery.trim() ? newQuery : null);
    },
    [updateUrlParam]
  );

  // ===== STATUS MUTATIONS =====
  /**
   * Update an item's status by ID
   * Supports both setting to a specific status or toggling to next
   */
  const updateStatus = useCallback(
    (id: string, newStatus: MediaStatus | 'toggle') => {
      setStored((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          const finalStatus = newStatus === 'toggle' ? getNextStatus(item.status) : newStatus;
          return { ...item, status: finalStatus };
        })
      );
    },
    [setStored]
  );

  const handleToggleStatus = useCallback(
    (id: string) => {
      updateStatus(id, 'toggle');
    },
    [updateStatus]
  );

  const setStatus = useCallback(
    (id: string, newStatus: MediaStatus) => {
      updateStatus(id, newStatus);
    },
    [updateStatus]
  );

  // ===== CRUD OPERATIONS =====
  const handleAddItem = useCallback(
    (itemToAdd: MediaItem) => {
      setStored((prev) => [itemToAdd, ...prev]);
      setShowAddModal(false);
    },
    [setStored]
  );

  const confirmDeleteItem = useCallback(() => {
    if (!pendingDeletion) return;

    setStored((prev) => prev.filter((item) => item.id !== pendingDeletion.id));
    setSelected(null);
    setPendingDeletion(null);
  }, [pendingDeletion, setStored]);

  const requestDeleteItem = useCallback(
    (id: string) => {
      const item = stored.find((i) => i.id === id);
      if (item) {
        setPendingDeletion({ id: item.id, title: item.title });
      }
    },
    [stored]
  );

  // ===== ITEM UPDATES =====
  /**
   * Update partial fields of an item (e.g., runtime, rating)
   * Also updates selected item if it matches
   */
  const updateItem = useCallback(
    (id: string, updates: Partial<MediaItem>) => {
      setStored((prev) =>
        prev.map((item) =>
          item.id === id ? ({ ...item, ...updates } as MediaItem) : item
        )
      );

      setSelected((prev) =>
        prev && prev.id === id ? ({ ...prev, ...updates } as MediaItem) : prev
      );
    },
    [setStored]
  );

  // ===== RETURN =====
  return {
    // Data
    list,
    filter: statusFilter,
    genres: allGenres,
    selected,
    isMounted,
    showAddModal,
    pendingDeletion,
    genreFilter,
    queryFilter,

    // Setters
    setFilter,
    setGenreFilter,
    setQueryFilter,
    setSelected,
    setShowAddModal,
    setPendingDeletion,

    // Mutations
    handleToggleStatus,
    setStatus,
    handleAddItem,
    updateItem,
    confirmDeleteItem,
    requestDeleteItem,
  };
}
