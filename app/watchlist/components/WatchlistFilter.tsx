'use client';
import React from "react";

type Props = {
  filter: 'all' | 'to-watch' | 'watching' | 'watched';
  setFilter: (f: 'all' | 'to-watch' | 'watching' | 'watched') => void;
};

export default function WatchlistFilter({ filter, setFilter }: Props) {
  const filters: Props["filter"][] = ["all", "to-watch", "watching", "watched"];

  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`text-sm px-3 py-1.5 rounded-md capitalize transition 
            ${f === filter
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          {f.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}

