'use client';
import React from "react";
import type { MediaItem } from '../mockWatchlist'
import Image from "next/image";


type Props = {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
  onToggleStatus?: (id: string) => void;
};


export default function WatchlistCard({ item, onOpen, onToggleStatus }: Props) {
  return (
    <div className="bg-surface rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <button onClick={() => onOpen(item)} className="w-full text-left">
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
          {item.poster ? (
            <Image
              src={item.poster}
              alt={item.title}
              width={300}
              height={450}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="text-sm text-gray-500">No image</div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{item.title}</h3>
            <span className="text-xs text-gray-400">{item.year}</span>
          </div>
          <p className="text-xs text-muted mt-2">{item.type.toUpperCase()}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
              {item.status ?? 'to-watch'}
            </span>
            {onToggleStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(item.id);
                }}
                className="text-xs underline text-primary"
              >
                Toggle status
              </button>
            )}
          </div>
        </div>
      </button>
    </div>
  )
}
