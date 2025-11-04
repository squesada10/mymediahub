export default function SearchSkeleton() {
  return (
    // Wrapper matching the results list container
    <div className="space-y-3 max-h-80 overflow-y-hidden pr-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex gap-4 p-3 border-b dark:border-gray-700 items-center animate-pulse"
        >
          {/* Poster Placeholder */}
          <div className="w-10 h-16 bg-gray-300 dark:bg-gray-700 rounded flex-shrink-0"></div>

          {/* Text Placeholders */}
          <div className="flex-grow space-y-2">
            {/* Title Line */}
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
            {/* Subtitle Line */}
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/5"></div>
          </div>

          {/* Button Placeholder */}
          <div className="px-3 py-1 rounded-lg bg-gray-300 dark:bg-gray-700 w-10 h-6 flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
}
