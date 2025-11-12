/**
 * Status-related constants and utilities
 * Centralizes all status configuration in one place
 */

export type MediaStatus = 'to-watch' | 'watching' | 'watched';

/**
 * Mapping of status to display text for UI labels
 */
const STATUS_TEXT: Record<MediaStatus, string> = {
  'to-watch': 'To Watch',
  'watching': 'Watching',
  'watched': 'Watched',
};

/**
 * Mapping of status to badge styling (for cards)
 */
const STATUS_BADGE_CLASSES: Record<MediaStatus, string> = {
  'watched': 'bg-green-500 text-white opacity-75',
  'watching': 'bg-yellow-500 text-black opacity-75',
  'to-watch': 'bg-gray-500 text-white opacity-75',
};

/**
 * Mapping of status to button color classes
 */
const STATUS_BUTTON_COLORS: Record<MediaStatus, string> = {
  'watched': 'bg-green-500',
  'watching': 'bg-yellow-500 dark:bg-yellow-500',
  'to-watch': 'bg-gray-500',
};

/**
 * Mapping of status to icon styling (for interactive elements)
 */
const STATUS_ICON_CLASSES: Record<MediaStatus, string> = {
  'watched': 'text-green-500 hover:text-green-400',
  'watching': 'text-yellow-500 hover:text-yellow-400',
  'to-watch': 'text-gray-500 hover:text-gray-400',
};

/**
 * Active button styling for each status
 * Darker shades with disabled appearance
 */
const STATUS_ACTIVE_BUTTON_CLASSES: Record<MediaStatus, string> = {
  'watched': 'bg-green-800 disabled:opacity-100 cursor-default',
  'watching': 'bg-yellow-700 disabled:opacity-100 cursor-default',
  'to-watch': 'bg-gray-700 disabled:opacity-100 cursor-default',
};

/**
 * Get all display information for a status
 * @param status - The media status
 * @returns Object with text, badge, button, and icon classes
 */
export function getStatusClasses(status?: MediaStatus) {
  const normalizedStatus = status ?? 'to-watch';
  
  return {
    text: STATUS_TEXT[normalizedStatus],
    badgeClass: STATUS_BADGE_CLASSES[normalizedStatus],
    colorClass: STATUS_BUTTON_COLORS[normalizedStatus],
    iconClass: STATUS_ICON_CLASSES[normalizedStatus],
  };
}

/**
 * Get button CSS classes for status buttons, handling active/inactive states
 * @param buttonStatus - The status this button represents
 * @param currentStatus - The current status of the item
 * @returns CSS class string for the button
 */
export function getStatusButtonClass(buttonStatus: MediaStatus, currentStatus: MediaStatus): string {
  const { colorClass } = getStatusClasses(buttonStatus);
  const isActive = buttonStatus === currentStatus;

  const baseClasses = "px-3 py-1 rounded text-white text-sm transition";

  if (isActive) {
    return `${baseClasses} ${STATUS_ACTIVE_BUTTON_CLASSES[buttonStatus]}`;
  }

  // Inactive button: use color with hover effect
  let inactiveClasses = `${baseClasses} ${colorClass} hover:opacity-80`;

  // Ensure black text for yellow button for readability
  if (buttonStatus === 'watching') {
    inactiveClasses += ' !text-black';
  }

  return inactiveClasses;
}

/**
 * Cycle to the next status in sequence: to-watch → watching → watched → to-watch
 * @param currentStatus - The current status
 * @returns The next status in the cycle
 */
export function getNextStatus(currentStatus: MediaStatus): MediaStatus {
  const statusCycle: MediaStatus[] = ['to-watch', 'watching', 'watched'];
  const currentIndex = statusCycle.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusCycle.length;
  return statusCycle[nextIndex];
}

/**
 * Validate if a value is a valid MediaStatus
 * @param value - The value to check
 * @returns True if the value is a valid MediaStatus
 */
export function isValidStatus(value: unknown): value is MediaStatus {
  return typeof value === 'string' && ['to-watch', 'watching', 'watched'].includes(value);
}
