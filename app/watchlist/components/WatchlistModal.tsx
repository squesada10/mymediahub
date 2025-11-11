'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import type { MediaItem, MovieItem } from "../types";
import SearchMediaForm from "./SearchMediaForm";
import { MediaStatus, getStatusButtonClass } from "@/lib/status-utils";


type Props = {
    item: MediaItem | null;
    onClose: () => void;
    onChangeStatus: (id: string, status: MediaStatus) => void;
    onDeleteItem?: (id: string) => void;
    onAddSearchItem?: (item: MediaItem) => void;
    onUpdateItem?: (id: string, updates: Partial<MediaItem>) => void;
};

export default function WatchlistModal({ item, onClose, onChangeStatus, onDeleteItem, onAddSearchItem, onUpdateItem }: Props) {
    // Local runtime state for movie items. Null = unknown, number = minutes
    const [runtime, setRuntime] = useState<number | null>(null);
    const [loadingRuntime, setLoadingRuntime] = useState(false);
    const [runtimeError, setRuntimeError] = useState<string | null>(null);

    const formatRuntime = (mins: number | null | undefined) => {
        const m = mins ?? 0;
        if (!m || m <= 0) return '—';
        if (m < 60) return `${m} min`;
        const h = Math.floor(m / 60);
        const mm = m % 60;
        return mm === 0 ? `${h}h` : `${h}h ${mm}m`;
    };

    const itemId = item?.id;
    const itemType = item?.type;
    const itemRuntimeMinutes = itemType === 'movie' ? (item as MovieItem).runtimeMinutes : undefined;

    // Fetch runtime from our server API for numeric TMDB ids when needed
    useEffect(() => {
        let mounted = true;
        setRuntime(null);
        setRuntimeError(null);

        if (!item) return;

        // If item already has runtimeMinutes set (mock or saved), use it
        if (item.type === 'movie') {
            const movie = item as MovieItem;
            if (movie.runtimeMinutes && movie.runtimeMinutes > 0) {
                setRuntime(movie.runtimeMinutes);
                return;
            }
        }

        // Detect numeric TMDB id strings (search adds numeric IDs as strings)
        const isNumericId = /^[0-9]+$/.test(item.id);
        if (item.type === 'movie' && isNumericId) {
            (async () => {
                setLoadingRuntime(true);
                try {
                    const res = await fetch(`/api/movie/${encodeURIComponent(item.id)}`);
                    let body: Record<string, unknown> | null = null;
                    try {
                        body = await res.json();
                    } catch {
                        body = null;
                    }

                    if (!res.ok) {
                        const errVal = body && (body as Record<string, unknown>)['error'];
                        const msg = typeof errVal === 'string' ? errVal : `TMDB error ${res.status}`;
                        console.error('Runtime fetch error', msg);
                        if (mounted) setRuntimeError(msg || 'Could not load duration');
                        return;
                    }

                    const runtimeVal = body && (body as Record<string, unknown>)['runtimeMinutes'];
                    const runtimeNum = typeof runtimeVal === 'number' ? runtimeVal : 0;
                    if (mounted) {
                        setRuntime(runtimeNum);
                        // Persist runtime back to stored watchlist if caller provided update function
                        if (runtimeNum > 0 && onUpdateItem && item) {
                            onUpdateItem(item.id, { ...(item.type === 'movie' ? { runtimeMinutes: runtimeNum } : {}) } as Partial<MediaItem>);
                        }
                    }
                } catch (err) {
                    console.error('Runtime fetch unexpected error', err);
                    if (mounted) setRuntimeError('Could not load duration');
                } finally {
                    if (mounted) setLoadingRuntime(false);
                }
            })();
        }

        return () => { mounted = false; };
    // Narrow dependencies to the fields we care about to avoid unnecessary re-runs
    }, [item, itemId, itemType, itemRuntimeMinutes, onUpdateItem]);

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
                            onAdd={onAddSearchItem ?? (() => {})}
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
                            {item?.type === 'movie' && (
                                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                                    Duration: {loadingRuntime ? 'Loading…' : formatRuntime(runtime ?? (item as MovieItem).runtimeMinutes)}
                                    {runtimeError && <span className="text-xs text-red-500"> — {runtimeError}</span>}
                                </p>
                            )}
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
