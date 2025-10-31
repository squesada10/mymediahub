'use client';

import React from "react";
import Image from "next/image";
import type { MediaItem, MediaStatus } from "../mockWatchlist";

type Props = {
  item: MediaItem | null;
  onClose: () => void;
  onChangeStatus: (id: string, status: MediaStatus) => void;
};

export default function WatchlistModal({ item, onClose, onChangeStatus }: Props) {
  if (!item) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 z-10">
        <div className="flex gap-4">
          {item.poster && (
            <Image
              src={item.poster}
              alt={item.title}
              width={300}
              height={450}
              className="w-32 h-48 object-cover rounded" />
          )}
          <div>
            <h2 className="text-xl font-bold">{item.title} <span className="text-sm text-gray-400">({item.year})</span></h2>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{item.overview}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onChangeStatus(item.id, 'watching')}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Mark as Watching
              </button>
              <button
                onClick={() => onChangeStatus(item.id, 'watched')}
                className="px-3 py-1 rounded bg-green-600 text-white text-sm"
              >
                Mark as Watched
              </button>
              <button
                onClick={() => onChangeStatus(item.id, 'to-watch')}
                className="px-3 py-1 rounded bg-red-600 text-white text-sm"
              >
                Mark as to-Watch
              </button>
              <button onClick={onClose} className="px-3 py-1 rounded border text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
