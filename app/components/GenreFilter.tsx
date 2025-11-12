'use client';

import { useState, useRef, useEffect } from 'react';

interface GenreFilterProps {
  genres: string[];
  currentGenre: string | null; // Currently selected genre from the URL
  setGenre: (genre: string | null) => void; // Function to update the URL
}

export default function GenreFilter({ genres, currentGenre, setGenre }: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLabel = currentGenre || 'Genre';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors 
                            ${currentGenre
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
      >
        {activeLabel}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-50 p-2 max-h-60 overflow-y-auto">
          {/* Option to clear filter */}
          <button
            onClick={() => { setGenre('all'); setIsOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors 
                                    // 💡 FIX: Consistent Active State color for "All Genres"
                                    ${!currentGenre ? 'bg-indigo-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            All Genres
          </button>

          <div className="border-t border-gray-700 my-1"></div>

          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => { setGenre(genre); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors 
                                        // 💡 FIX: Consistent Active State color for genre list items
                                        ${currentGenre === genre ? 'bg-indigo-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
