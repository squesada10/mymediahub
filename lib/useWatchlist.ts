import { useMemo, useState, useEffect, useCallback, SetStateAction } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
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
  genres: string[]; // All unique genres found
  genreFilter: string | null; // The currently active genre
  setGenreFilter: (genre: string | null) => void;

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
const ALL_AVAILABLE_GENRES = [
  'Action',
  'Adventure',
  'Action & Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Kids',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'News',
  'Reality',
  'Romance',
  'Science-Fiction',
  'Sci-Fi & Fantasy',
  'Soap',
  'Talk',
  'TV Movie',
  'Thriller',
  'War',
  'War & Politics',
  'Western'
].sort();

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
    let filteredList = stored;

    // Apply Status Filter first ('watched', 'watching', 'to-watch')
    if (statusFilter !== 'all') {
      filteredList = filteredList.filter((s) => s.status === statusFilter);
    }

    // 💡 Apply Type Filter (from URL) second
    if (typeFilter) {
      filteredList = filteredList.filter((s) => s.type === typeFilter);
    }

    // 💡 3c. Apply Genre Filter
    if (genreFilter) {
      // Convert the selected filter genre to a standardized format (e.g., lowercase and trimmed)
      const standardizedFilter = genreFilter.toLowerCase().trim();

      filteredList = filteredList.filter((s) =>
        // We check if ANY genre in the item's genres array matches the standardized filter
        s.genres?.some(itemGenre =>
          itemGenre.toLowerCase().trim() === standardizedFilter
        )
      );
    }

    return filteredList;
  }, [stored, statusFilter, typeFilter, genreFilter]);

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
    filter: statusFilter,
    genres: allGenres,
    selected,
    isMounted,
    showAddModal,
    pendingDeletion,
    genreFilter,
    setFilter,
    setGenreFilter,
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
