import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WatchlistPage from '@/app/watchlist/page';
import type { MediaItem } from '@/app/watchlist/types';


const mockWatchlistData: MediaItem[] = [
  { id: '1', title: 'Test Movie 1', type: 'movie', status: 'watched', genres: ['Action'], year: 2020, overview: 'Overview 1', poster: '', runtimeMinutes: 120 },
  { id: '2', title: 'Test Series 2', type: 'series', status: 'watching', genres: ['Drama'], year: 2021, overview: 'Overview 2', poster: '', episodesWatched: 5 },
];

vi.mock('@/app/watchlist/components/WatchlistCard', () => ({
  default: vi.fn(({ item, onOpen }) => (
    // Render a simple div that is easily searchable and calls the spy function
    <div data-testid={`card-${item.id}`} onClick={() => onOpen(item)}>
      {item.title}
    </div>
  )),
}));

// The page.tsx component relies on useSearchParams and useRouter (via useWatchlist)
// We must mock these to prevent errors during testing.
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(), // Ensure get returns null/undefined by default
    toString: vi.fn(() => ''),
  })),
}));

const mockSetSelected = vi.fn();

// Mock the main hook to control its output and prevent side effects
// (like local storage usage) during component rendering.
vi.mock('@/lib/useWatchlist', () => ({
  // This mocks the return structure of my useWatchlist hook
  useWatchlist: vi.fn(() => ({
    list: [], // Start with an empty list for the render test
    filter: 'all',
    genres: ['Action', 'Drama'],
    selected: null,
    isMounted: true,
    showAddModal: false,
    pendingDeletion: null,
    genreFilter: null,
    queryFilter: null,
    setFilter: vi.fn(),
    setGenreFilter: vi.fn(),
    setQueryFilter: vi.fn(),
    setSelected: vi.fn(),
    handleToggleStatus: vi.fn(),
    setStatus: vi.fn(),
    handleAddItem: vi.fn(),
    setShowAddModal: vi.fn(),
    confirmDeleteItem: vi.fn(),
    requestDeleteItem: vi.fn(),
    setPendingDeletion: vi.fn(),
  })),
}));

describe('WatchlistPage', () => {
  // --- Application Render Test ---
  test('should render the main page without crashing (smoke test)', () => {
    render(<WatchlistPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // --- Component Logic Test ---
  // test('should display the correct number of list items', () => {
  //   // The mock hook returns two items
  //   render(<WatchlistPage />);
  //
  //   // Assert that the title of the first item is visible
  //   expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
  //
  //   // Assert that the title of the second item is visible
  //   expect(screen.getByText('Test Series 2')).toBeInTheDocument();
  //
  // });
  // test.todo('should open the modal when a card is clicked');
});
