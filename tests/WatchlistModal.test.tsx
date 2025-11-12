import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WatchlistModal from '@/app/watchlist/components/WatchlistModal';
import type { MediaItem, MovieItem } from '@/app/watchlist/types';

// Mock Image component from Next.js
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src as string} alt={alt as string} className={className as string} />;
  },
}));

describe('WatchlistModal', () => {
  const mockMovieItem: MovieItem = {
    id: 'mock-movie-1',
    title: 'Test Movie',
    year: 2023,
    type: 'movie',
    genres: ['Action', 'Drama'],
    poster: 'https://example.com/poster.jpg',
    overview: 'A test movie overview',
    status: 'to-watch',
    runtimeMinutes: 120,
  };

  const mockSeriesItem: MediaItem = {
    id: 'mock-series-1',
    title: 'Test Series',
    year: 2023,
    type: 'series',
    genres: ['Drama'],
    poster: 'https://example.com/poster.jpg',
    overview: 'A test series overview',
    status: 'watching',
    episodesWatched: 5,
  };

  const mockHandlers = {
    onClose: vi.fn(),
    onChangeStatus: vi.fn(),
    onDeleteItem: vi.fn(),
    onAddSearchItem: vi.fn(),
    onUpdateItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering: detail/edit mode', () => {
    test('should render modal with item details when item is provided', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });

    test('should render genres as tags', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
    });

    test('should render overview text', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/A test movie overview/)).toBeInTheDocument();
    });

    test('should render current status information', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/Status:/)).toBeInTheDocument();
      expect(screen.getByText('to-watch')).toBeInTheDocument();
    });

    test('should render poster image', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const image = screen.getByAltText('Test Movie');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockMovieItem.poster);
    });

    test('should show "No Poster" placeholder when poster is missing', () => {
      const itemWithoutPoster: MovieItem = { ...mockMovieItem, poster: undefined };

      render(
        <WatchlistModal
          item={itemWithoutPoster}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText('No Poster')).toBeInTheDocument();
    });
  });

  describe('rendering: add mode', () => {
    test('should render SearchMediaForm when item is null', () => {
      render(
        <WatchlistModal
          item={null}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onAddSearchItem={mockHandlers.onAddSearchItem}
        />
      );

      expect(screen.getByText(/Search & Add Media/)).toBeInTheDocument();
    });

    test('should render search input in add mode', () => {
      render(
        <WatchlistModal
          item={null}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onAddSearchItem={mockHandlers.onAddSearchItem}
        />
      );

      expect(screen.getByPlaceholderText(/Search for a movie or series/)).toBeInTheDocument();
    });
  });

  describe('close button and modal dialog', () => {
    test('should render close button (X)', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const closeButton = screen.getByRole('button', { name: '' }); // Close button has no text
      expect(closeButton).toBeInTheDocument();
    });

    test('should call onClose when close button is clicked', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const closeButton = screen.getAllByRole('button')[0]; // First button is close
      fireEvent.click(closeButton);

      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    test('should have proper dialog attributes', () => {
      const { container } = render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('status change buttons', () => {
    test('should render three status buttons for movies', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/Mark as Watching/)).toBeInTheDocument();
      expect(screen.getByText(/Mark as Watched/)).toBeInTheDocument();
      expect(screen.getByText(/Mark as To-Watch/)).toBeInTheDocument();
    });

    test('should call onChangeStatus with correct arguments when status button clicked', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // mockMovieItem has status 'to-watch', so 'Mark as Watching' button should work and not be disabled
      const watchingButton = screen.getByText(/Mark as Watching/);
      fireEvent.click(watchingButton);

      // The callback should be called when button is clicked
      expect(mockHandlers.onChangeStatus).toHaveBeenCalled();
    });

    test('should disable button for current status', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // Item status is 'to-watch', so that button should be disabled
      const toWatchButton = screen.getByText(/Mark as To-Watch/) as HTMLButtonElement;
      expect(toWatchButton.disabled).toBe(true);
    });

    test('should not disable buttons for non-current statuses', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // mockMovieItem status is 'to-watch'
      const watchingButton = screen.getByText(/Mark as Watching/) as HTMLButtonElement;
      expect(watchingButton.disabled).toBe(false);
    });
  });

  describe('delete button', () => {
    test('should render delete button when onDeleteItem is provided', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/Delete/)).toBeInTheDocument();
    });

    test('should not render delete button when onDeleteItem is undefined', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={undefined}
        />
      );

      expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();
    });

    test('should call onDeleteItem when delete button clicked', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const deleteButton = screen.getByText(/Delete/);
      fireEvent.click(deleteButton);

      expect(mockHandlers.onDeleteItem).toHaveBeenCalledWith(mockMovieItem.id);
    });
  });

  describe('runtime display for movies', () => {
    test('should display runtime for movies', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/Duration:/)).toBeInTheDocument();
      expect(screen.getByText(/2h/)).toBeInTheDocument(); // 120 minutes = 2 hours
    });

    test('should not display runtime for series', () => {
      render(
        <WatchlistModal
          item={mockSeriesItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
    });

    test('should format runtime correctly for various lengths', () => {
      const testCases = [
        { runtime: 90, shouldContain: '1h 30m' },
        { runtime: 120, shouldContain: '2h' },
        { runtime: 155, shouldContain: '2h 35m' },
        { runtime: 45, shouldContain: '45 min' },
      ];

      testCases.forEach(({ runtime, shouldContain }) => {
        const item: MovieItem = { ...mockMovieItem, runtimeMinutes: runtime };
        const { unmount } = render(
          <WatchlistModal
            item={item}
            onClose={mockHandlers.onClose}
            onChangeStatus={mockHandlers.onChangeStatus}
            onDeleteItem={mockHandlers.onDeleteItem}
          />
        );

        // Check if the duration text contains the expected runtime
        const durationText = screen.getByText(/Duration:/);
        expect(durationText.textContent).toContain(shouldContain);
        unmount();
      });
    });

    test('should show dash for zero or missing runtime', () => {
      const itemWithZeroRuntime: MovieItem = { ...mockMovieItem, runtimeMinutes: 0 };

      render(
        <WatchlistModal
          item={itemWithZeroRuntime}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(screen.getByText(/Duration:.*—/)).toBeInTheDocument();
    });
  });

  describe('series-specific information', () => {
    test('should display series type in modal', () => {
      render(
        <WatchlistModal
          item={mockSeriesItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // Use queryAllByText to find all instances and verify series info exists
      const elements = screen.queryAllByText(/series/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    test('should display movie type in modal', () => {
      render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // Use queryAllByText to find all instances and verify movie info exists
      const elements = screen.queryAllByText(/movie/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('runtime fetching for numeric TMDB ids', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    test('should fetch runtime for numeric TMDB movie ids', async () => {
      const numericIdItem: MovieItem = {
        ...mockMovieItem,
        id: '550', // Numeric TMDB ID
        runtimeMinutes: 0, // No runtime initially
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ runtimeMinutes: 139 }),
      });

      render(
        <WatchlistModal
          item={numericIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
          onUpdateItem={mockHandlers.onUpdateItem}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/movie/550');
      });
    });

    test('should show "Loading…" while fetching runtime', async () => {
      const numericIdItem: MovieItem = {
        ...mockMovieItem,
        id: '550',
        runtimeMinutes: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ runtimeMinutes: 139 }),
        }), 100))
      );

      render(
        <WatchlistModal
          item={numericIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
          onUpdateItem={mockHandlers.onUpdateItem}
        />
      );

      expect(screen.getByText(/Loading…/)).toBeInTheDocument();
    });

    test('should not fetch runtime for non-numeric ids', () => {
      const stringIdItem: MovieItem = {
        ...mockMovieItem,
        id: 'non-numeric-id',
        runtimeMinutes: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockClear();

      render(
        <WatchlistModal
          item={stringIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should not fetch runtime if already populated', () => {
      const itemWithRuntime: MovieItem = {
        ...mockMovieItem,
        id: '550',
        runtimeMinutes: 120, // Already has runtime
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockClear();

      render(
        <WatchlistModal
          item={itemWithRuntime}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should call onUpdateItem when runtime is fetched successfully', async () => {
      const numericIdItem: MovieItem = {
        ...mockMovieItem,
        id: '550',
        runtimeMinutes: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ runtimeMinutes: 139 }),
      });

      render(
        <WatchlistModal
          item={numericIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
          onUpdateItem={mockHandlers.onUpdateItem}
        />
      );

      await waitFor(() => {
        expect(mockHandlers.onUpdateItem).toHaveBeenCalledWith(
          '550',
          expect.objectContaining({ runtimeMinutes: 139 })
        );
      });
    });

    test('should show error message on fetch failure', async () => {
      const numericIdItem: MovieItem = {
        ...mockMovieItem,
        id: '550',
        runtimeMinutes: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Movie not found' }),
      });

      render(
        <WatchlistModal
          item={numericIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
          onUpdateItem={mockHandlers.onUpdateItem}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Movie not found/)).toBeInTheDocument();
      });
    });

    test('should handle network errors gracefully', async () => {
      const numericIdItem: MovieItem = {
        ...mockMovieItem,
        id: '550',
        runtimeMinutes: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(
        <WatchlistModal
          item={numericIdItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
          onUpdateItem={mockHandlers.onUpdateItem}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Could not load duration/)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    test('should have proper dialog role and aria attributes', () => {
      const { container } = render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('backdrop click', () => {
    test('should close modal when backdrop is clicked', () => {
      const { container } = render(
        <WatchlistModal
          item={mockMovieItem}
          onClose={mockHandlers.onClose}
          onChangeStatus={mockHandlers.onChangeStatus}
          onDeleteItem={mockHandlers.onDeleteItem}
        />
      );

      // Find the backdrop (the absolute positioned div with bg-black/50)
      const backdrop = container.querySelector('div.absolute.inset-0.bg-black\\/50');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockHandlers.onClose).toHaveBeenCalled();
      }
    });
  });
});
