/**
 * Runtime formatting utilities for displaying movie/video durations
 */

/**
 * Format minutes into human-readable duration string
 * Examples:
 * - 45 minutes → "45 min"
 * - 90 minutes → "1h 30m"
 * - 120 minutes → "2h"
 * - 0 or undefined → "—"
 *
 * @param minutes - Duration in minutes (or null/undefined for unknown)
 * @returns Formatted duration string
 */
export function formatRuntime(minutes: number | null | undefined): string {
  const m = minutes ?? 0;

  // Return dash for missing/zero runtime
  if (!m || m <= 0) {
    return '—';
  }

  // Under 60 minutes: show as "X min"
  if (m < 60) {
    return `${m} min`;
  }

  // 60+ minutes: show as "Xh" or "Xh Ym"
  const hours = Math.floor(m / 60);
  const remainingMinutes = m % 60;

  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
}

/**
 * Check if a runtime value is valid (positive number)
 * @param runtime - Runtime in minutes
 * @returns True if runtime is a positive number
 */
export function isValidRuntime(runtime: unknown): runtime is number {
  return typeof runtime === 'number' && runtime > 0;
}

/**
 * Check if a runtime is empty/missing/zero
 * @param runtime - Runtime in minutes
 * @returns True if runtime is missing, null, or zero
 */
export function isRuntimeEmpty(runtime: number | null | undefined): boolean {
  return runtime === null || runtime === undefined || runtime <= 0;
}
