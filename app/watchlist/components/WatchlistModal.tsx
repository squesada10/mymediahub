'use client';

import Image from "next/image";
import type { MediaItem } from "../types";
import SearchMediaForm from "./SearchMediaForm";
import { MediaStatus, getStatusButtonClass } from "@/lib/status-utils";


type Props = {
    item: MediaItem | null;
    onClose: () => void;
    onChangeStatus: (id: string, status: MediaStatus) => void;
    onDeleteItem?: (id: string) => void;
    onAddSearchItem?: (item: MediaItem) => void;
};

export default function WatchlistModal({ item, onClose, onChangeStatus, onDeleteItem, onAddSearchItem }: Props) {
    // Determine the modal mode
    const isAdding = item === null;
    if (!item && !isAdding) {
        return null;
    }

    const currentStatus = item?.status ?? 'to-watch';

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 z-10 overflow-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* ===== CONDITIONAL RENDERING: ADD FORM or DETAIL VIEW ===== */}

                {isAdding ? (
                    /* --- RENDER THE NEW SEARCH FORM --- */
                    <SearchMediaForm
                        onAdd={onAddSearchItem!}
                        onClose={onClose}
                    />
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
                            <div className="flex flex-wrap gap-2 pt-2">
                                {item.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1 bg-gray-700 text-xs font-medium rounded-full text-gray-300"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 capitalize">
                                {item!.type} | Status: <span className="font-semibold text-black dark:text-white">{item!.status ?? 'to-watch'}</span>
                            </p>
                            <p className="text-sm mt-3 text-gray-600 dark:text-gray-300 flex-grow">{item!.overview}</p>

                            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t dark:border-gray-700">
                                {/* Status Change Buttons */}
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'watching')}
                                    disabled={currentStatus === 'watching'}
                                    className={getStatusButtonClass('watching', currentStatus)} >
                                    Mark as Watching
                                </button>
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'watched')}
                                    disabled={currentStatus === 'to-watch'}
                                    className={getStatusButtonClass('watched', currentStatus)} >
                                    Mark as Watched
                                </button>
                                <button
                                    onClick={() => onChangeStatus(item!.id, 'to-watch')}
                                    disabled={currentStatus === 'to-watch'}
                                    className={getStatusButtonClass('to-watch', currentStatus)} >
                                    Mark as To-Watch
                                </button>
                                {onDeleteItem && (
                                    <button
                                        onClick={() => onDeleteItem(item!.id)}
                                        className="px-3 py-1 rounded bg-red-700 text-white text-sm hover:bg-red-800 transition ml-auto" >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
