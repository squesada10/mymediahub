'use client';

import { useState } from "react"; 
import Image from "next/image";
import type { MediaItem, MediaStatus, NewMediaItemData } from "../mockWatchlist"; 

type Props = {
    item: MediaItem | null;
    onClose: () => void;
    onChangeStatus: (id: string, status: MediaStatus) => void;
    onAddItem?: (item: NewMediaItemData) => void; 
};

export default function WatchlistModal({ item, onClose, onChangeStatus, onAddItem }: Props) {
    // Determine the modal mode
    const isAdding = item === null && onAddItem !== undefined; 

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'movie' | 'series'>('movie');
    const [overview, setOverview] = useState('');
    
    // Return null if it's not the 'Add' mode AND no item is selected
    if (!item && !isAdding) return null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // This check prevents submission if the title is empty or onAddItem isn't available
        if (!title.trim() || !onAddItem) return; 

        // Call the parent function with the new item data
        onAddItem({
            title: title.trim(),
            type,
            overview: overview.trim(),
        });
        // State reset (clearing form) is not strictly needed here since the modal component is unmounted when closed.
    }
    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 z-10 overflow-auto max-h-[90vh]">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* ===== CONDITIONAL RENDERING: ADD FORM or DETAIL VIEW ===== */}
                
                {isAdding ? (
                    /* --- ADD NEW ITEM FORM --- */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Add New Media Item (Manual)</h2>
                        
                        <label className="block">
                            <span className="text-sm font-medium">Title <span className="text-red-500">*</span></span>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Dune or The Mandalorian"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </label>
                        
                        <label className="block">
                            <span className="text-sm font-medium">Type</span>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'movie' | 'series')}
                                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                <option value="movie">Movie</option>
                                <option value="series">Series</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium">Overview (Optional)</span>
                            <textarea
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                rows={3}
                                placeholder="Brief summary of the plot or why you're watching it."
                                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </label>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50 hover:bg-blue-700 transition"
                            >
                                Add to Watchlist
                            </button>
                        </div>
                    </form>

                ) : (
                /* --- DETAIL/EDIT ITEM VIEW --- */
                    <div className="flex gap-4">
                        {item!.poster ? (
                            <Image
                                src={item!.poster}
                                alt={item!.title}
                                width={128}
                                height={192}
                                className="w-32 h-48 object-cover rounded flex-shrink-0" />
                        ) : (
                            <div className="w-32 h-48 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">No Poster</div>
                        )}
                        
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">{item!.title} <span className="text-sm text-gray-400">({item!.year})</span></h2>
                            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 capitalize">
                                {item!.type} | Status: <span className="font-semibold text-black dark:text-white">{item!.status ?? 'to-watch'}</span>
                            </p>
                            <p className="text-sm mt-3 text-gray-600 dark:text-gray-300 flex-grow">{item!.overview}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t dark:border-gray-700">
                                {/* Status Change Buttons */}
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'watching')}
                                    className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                                >
                                    Mark as Watching
                                </button>
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'watched')}
                                    className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition"
                                >
                                    Mark as Watched
                                </button>
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'to-watch')}
                                    className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                                >
                                    Mark as To-Watch
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
