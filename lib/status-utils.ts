export type MediaStatus = 'to-watch' | 'watching' | 'watched';
// 1. Unified Helper: Provides all classes needed by both Card and Modal
export const getStatusClasses = (status?: MediaStatus) => {
  switch (status) {
    case 'watched':
      return {
        text: 'Watched',
        // Card Badge Style (from original WatchlistCard)
        badgeClass: 'bg-green-500 text-white',
        // Modal Button Base Color (using the Card's color for consistency)
        colorClass: 'bg-green-500',
        // Card Icon Style
        iconClass: 'text-green-500 hover:text-green-400',
      };
    case 'watching':
      return {
        text: 'Watching',
        // Card Badge Style
        badgeClass: 'bg-yellow-500 text-black',
        // Modal Button Base Color
        colorClass: 'bg-yellow-500 dark:bg-yellow-500', // Keep dark mode specific yellow
        // Card Icon Style
        iconClass: 'text-yellow-500 hover:text-yellow-400',
      };
    case 'to-watch':
    default:
      return {
        text: 'To Watch',
        // Card Badge Style (using the noticeable gray)
        badgeClass: 'bg-gray-500 text-white',
        // Modal Button Base Color
        colorClass: 'bg-gray-500',
        // Card Icon Style
        iconClass: 'text-gray-500 hover:text-gray-400',
      };
  }
};

export const getStatusButtonClass = (buttonStatus: MediaStatus, currentStatus: MediaStatus) => {
  const { colorClass } = getStatusClasses(buttonStatus);
  const isActive = buttonStatus === currentStatus;

  let baseClasses = "px-3 py-1 rounded text-white text-sm transition ";

  if (isActive) {
    // Active Status: Darker background, disabled look (Use 700/800 shades for darkness)
    if (buttonStatus === 'watched') baseClasses += 'bg-green-800 disabled:opacity-100 cursor-default';
    else if (buttonStatus === 'watching') baseClasses += 'bg-yellow-700 disabled:opacity-100 cursor-default';
    else if (buttonStatus === 'to-watch') baseClasses += 'bg-gray-700 disabled:opacity-100 cursor-default';

  } else {
    // Inactive Status: Use the standard color class with hover effect
    baseClasses += `${colorClass} hover:opacity-80`;

    // Ensure black text for the yellow button on light mode for readability
    if (buttonStatus === 'watching') {
      baseClasses += ' !text-black';
    }
  }

  return baseClasses;
};
