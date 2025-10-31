import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistCard from '../app/watchlist/components/WatchlistCard';
import type { MediaItem } from '../app/watchlist/mockWatchlist';

const mockItem: MediaItem = {
  id: 'test-1',
  title: 'Test Movie',
  year: 2020,
  type: 'movie',
  poster: '',
  overview: 'Test overview',
  status: 'to-watch',
};

describe('WatchlistCard', () => {
  test('renders title and year', () => {
    render(<WatchlistCard item={mockItem} onOpen={() => { }} />);
    expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();
    expect(screen.getByText(/2020/i)).toBeInTheDocument();
  });

  test('calls onOpen when clicking card', () => {
    const onOpen = vi.fn();
    render(<WatchlistCard item={mockItem} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: `View details for ${mockItem.title}` }));
    expect(onOpen).toHaveBeenCalled();
  });
});

