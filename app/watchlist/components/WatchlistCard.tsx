'use client';
import type { MediaItem } from '../mockWatchlist'
import Image from "next/image";


type Props = {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
  onToggleStatus?: (id: string) => void;
};

const getStatusClasses = (status?: MediaItem['status']) => {
  switch (status) {
    case 'watched':
      return {
        text: 'Watched',
        badgeClass: 'bg-green-500 text-white',
        iconClass: 'text-green-500 hover:text-green-400',
      };
    case 'watching':
      return {
        text: 'Watching',
        badgeClass: 'bg-yellow-500 text-black',
        iconClass: 'text-yellow-500 hover:text-yellow-400',
      };
    case 'to-watch':
    default:
      return {
        text: 'To Watch',
        badgeClass: 'bg-gray-500 text-white',
        iconClass: 'text-gray-500 hover:text-gray-400',
      };
  }
};

export default function WatchlistCard({ item, onOpen, onToggleStatus }: Props) {

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
    </div>
  );
}
