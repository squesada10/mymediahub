'use client';
import Image from "next/image";
import { getStatusClasses } from "@/lib/status-constants";
import type { MediaItem } from "../types";

type Props = {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
  onToggleStatus?: (id: string) => void;
  onDeleteItem: (id: string) => void;
};


export default function WatchlistCard({ item, onOpen, onToggleStatus, onDeleteItem }: Props) {

  const { text, badgeClass, iconClass } = getStatusClasses(item.status);
  const posterUrl = item.poster || '/placeholder-poster.png';

  // Fallback for media type
  const mediaType = item.type === 'movie' ? 'Movie' : 'Series';

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
      {/* Clickable Area to Open Detail Modal */}
      <div
        onClick={() => onOpen(item)}
        className="cursor-pointer">
        <div className="w-full aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={item.title}
            width={200}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Title and Info Overlay */}
        <div className="p-3">
          <h3 className="text-lg font-semibold truncate">{item.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mediaType}{item.year && ` (${item.year})`}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass}`} >
        {text}
      </span>

      {/* Quick Status Change Button */}
      {/* We stop event propagation so clicking the icon doesn't trigger onOpen (the detail modal) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the onOpen on the parent div from firing
          if (onToggleStatus) {
            onToggleStatus(item.id);
          }
        }}
        title={`Change status from ${text} to next`}
        className={`absolute top-3 right-3 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md transition-colors ${iconClass}`} >
        {/* Simple Checkmark Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.4 14.75c-.38.598-1.151.789-1.749.38L2.25 14.868a.75.75 0 0 1 1.04-1.04l5.378 5.489 9.023-14.168a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the card's onOpen from firing
          onDeleteItem(item.id);
        }}
        title={`Delete ${item.title}`}
        className="absolute bottom-3 right-3 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md 
           text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 
           hover:scale-110 hover:shadow-lg transition-all z-10 translate-y-0.5" >
        {/* Cleaned-up Trash Can SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 64 64">
          <path d="M48.9 8.8h-7.7V7.1c0-3-2.4-5.4-5.4-5.4h-7.7c-3 0-5.4 2.4-5.4 5.4v1.7H15c-2.9 0-5.3 2.4-5.3 5.3v3c0 2.2 1.3 4 3.2 4.8l1.6 34.6c.2 3.3 2.8 5.8 6.1 5.8h22.5c3.3 0 6-2.6 6.1-5.8L51 21.8c1.9-.8 3.2-2.7 3.2-4.8v-3c0-2.8-2.4-5.2-5.3-5.2M27.3 7.1c0-.5.4-.9.9-.9h7.7c.5 0 .9.4.9.9v1.7h-9.4V7.1zm-13 7c0-.4.3-.8.8-.8h33.8c.4 0 .8.3.8.8v3c0 .4-.3.8-.8.8H15.1c-.4 0-.8-.3-.8-.8zm28.9 43.7H20.8c-.9 0-1.6-.7-1.6-1.5l-1.6-33.9h28.9l-1.6 33.9c-.1.8-.8 1.5-1.7 1.5" />
          <path d="M32 32.4c-1.2 0-2.3 1-2.3 2.3v12.7c0 1.2 1 2.3 2.3 2.3c1.2 0 2.3-1 2.3-2.3V34.7c0-1.3-1.1-2.3-2.3-2.3m8 2c-1.3-.1-2.3.8-2.4 2.1l-.6 8.8c-.1 1.2.8 2.3 2.1 2.4h.2c1.2 0 2.2-.9 2.2-2.1l.6-8.8c0-1.3-.9-2.3-2.1-2.4m-16.1 0c-1.2.1-2.2 1.2-2.1 2.4l.7 8.8c.1 1.2 1.1 2.1 2.2 2.1h.2c1.2-.1 2.2-1.2 2.1-2.4l-.7-8.8c0-1.3-1.1-2.2-2.4-2.1" />
        </svg>
      </button>
    </div>
  );
}
