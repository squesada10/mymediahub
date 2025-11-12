import { describe, test, expect } from 'vitest';
import { getStatusClasses, getStatusButtonClass } from '@/lib/status-constants';
import type { MediaStatus } from '@/lib/status-constants';

describe('status-utils', () => {
  describe('getStatusClasses', () => {
    describe('for "watched" status', () => {
      test('should return correct text', () => {
        const classes = getStatusClasses('watched');
        expect(classes.text).toBe('Watched');
      });

      test('should return green badge class', () => {
        const classes = getStatusClasses('watched');
        expect(classes.badgeClass).toContain('bg-green-500');
        expect(classes.badgeClass).toContain('text-white');
      });

      test('should return green color class', () => {
        const classes = getStatusClasses('watched');
        expect(classes.colorClass).toContain('bg-green-500');
      });

      test('should return green icon class', () => {
        const classes = getStatusClasses('watched');
        expect(classes.iconClass).toContain('text-green-500');
        expect(classes.iconClass).toContain('hover:text-green-400');
      });
    });

    describe('for "watching" status', () => {
      test('should return correct text', () => {
        const classes = getStatusClasses('watching');
        expect(classes.text).toBe('Watching');
      });

      test('should return yellow badge class', () => {
        const classes = getStatusClasses('watching');
        expect(classes.badgeClass).toContain('bg-yellow-500');
        expect(classes.badgeClass).toContain('text-black');
      });

      test('should return yellow color class', () => {
        const classes = getStatusClasses('watching');
        expect(classes.colorClass).toContain('bg-yellow-500');
      });

      test('should return yellow icon class', () => {
        const classes = getStatusClasses('watching');
        expect(classes.iconClass).toContain('text-yellow-500');
        expect(classes.iconClass).toContain('hover:text-yellow-400');
      });
    });

    describe('for "to-watch" status', () => {
      test('should return correct text', () => {
        const classes = getStatusClasses('to-watch');
        expect(classes.text).toBe('To Watch');
      });

      test('should return gray badge class', () => {
        const classes = getStatusClasses('to-watch');
        expect(classes.badgeClass).toContain('bg-gray-500');
        expect(classes.badgeClass).toContain('text-white');
      });

      test('should return gray color class', () => {
        const classes = getStatusClasses('to-watch');
        expect(classes.colorClass).toContain('bg-gray-500');
      });

      test('should return gray icon class', () => {
        const classes = getStatusClasses('to-watch');
        expect(classes.iconClass).toContain('text-gray-500');
        expect(classes.iconClass).toContain('hover:text-gray-400');
      });
    });

    describe('for undefined status', () => {
      test('should default to "to-watch" classes', () => {
        const classes = getStatusClasses(undefined);
        expect(classes.text).toBe('To Watch');
        expect(classes.badgeClass).toContain('bg-gray-500');
        expect(classes.colorClass).toContain('bg-gray-500');
      });
    });

    describe('consistency between status values', () => {
      test('should always return object with text, badgeClass, colorClass, iconClass', () => {
        const statuses: MediaStatus[] = ['watched', 'watching', 'to-watch'];
        statuses.forEach(status => {
          const classes = getStatusClasses(status);
          expect(classes).toHaveProperty('text');
          expect(classes).toHaveProperty('badgeClass');
          expect(classes).toHaveProperty('colorClass');
          expect(classes).toHaveProperty('iconClass');
          expect(typeof classes.text).toBe('string');
          expect(typeof classes.badgeClass).toBe('string');
          expect(typeof classes.colorClass).toBe('string');
          expect(typeof classes.iconClass).toBe('string');
        });
      });
    });
  });

  describe('getStatusButtonClass', () => {
    describe('active button states (button matches current status)', () => {
      test('should return dark green for active "watched" button', () => {
        const classes = getStatusButtonClass('watched', 'watched');
        expect(classes).toContain('bg-green-800');
        expect(classes).toContain('disabled:opacity-100');
        expect(classes).toContain('cursor-default');
      });

      test('should return dark yellow for active "watching" button', () => {
        const classes = getStatusButtonClass('watching', 'watching');
        expect(classes).toContain('bg-yellow-700');
        expect(classes).toContain('disabled:opacity-100');
        expect(classes).toContain('cursor-default');
      });

      test('should return dark gray for active "to-watch" button', () => {
        const classes = getStatusButtonClass('to-watch', 'to-watch');
        expect(classes).toContain('bg-gray-700');
        expect(classes).toContain('disabled:opacity-100');
        expect(classes).toContain('cursor-default');
      });

      test('active button should have cursor-default', () => {
        const statuses: MediaStatus[] = ['watched', 'watching', 'to-watch'];
        statuses.forEach(status => {
          const classes = getStatusButtonClass(status, status);
          expect(classes).toContain('cursor-default');
        });
      });
    });

    describe('inactive button states (button does not match current status)', () => {
      test('should return standard color for inactive "watched" button', () => {
        const classes = getStatusButtonClass('watched', 'to-watch');
        expect(classes).toContain('bg-green-500');
        expect(classes).toContain('hover:opacity-80');
        expect(classes).not.toContain('cursor-default');
      });

      test('should return standard color for inactive "watching" button', () => {
        const classes = getStatusButtonClass('watching', 'to-watch');
        expect(classes).toContain('bg-yellow-500');
        expect(classes).toContain('hover:opacity-80');
        expect(classes).toContain('!text-black'); // Black text for yellow button
      });

      test('should return standard color for inactive "to-watch" button', () => {
        const classes = getStatusButtonClass('to-watch', 'watched');
        expect(classes).toContain('bg-gray-500');
        expect(classes).toContain('hover:opacity-80');
      });

      test('inactive button should have hover effect', () => {
        const statuses: MediaStatus[] = ['watched', 'watching', 'to-watch'];
        statuses.forEach(status => {
          // For each status, test it as an INACTIVE button (current status is different)
          let currentStatus: MediaStatus = 'to-watch';
          if (status === 'to-watch') currentStatus = 'watched'; // Make sure it's different
          const classes = getStatusButtonClass(status, currentStatus);
          expect(classes).toContain('hover:opacity-80');
        });
      });
    });

    describe('all status combinations', () => {
      const statuses: MediaStatus[] = ['watched', 'watching', 'to-watch'];

      test('should always include base classes', () => {
        statuses.forEach(buttonStatus => {
          statuses.forEach(currentStatus => {
            const classes = getStatusButtonClass(buttonStatus, currentStatus);
            expect(classes).toContain('px-3');
            expect(classes).toContain('py-1');
            expect(classes).toContain('rounded');
            expect(classes).toContain('text-white');
            expect(classes).toContain('text-sm');
            expect(classes).toContain('transition');
          });
        });
      });

      test('should return different classes for active vs inactive states', () => {
        statuses.forEach(status => {
          const activeClasses = getStatusButtonClass(status, status);
          // For inactive, use a different status
          const inactiveStatus: MediaStatus = status === 'watched' ? 'to-watch' : 'watched';
          const inactiveClasses = getStatusButtonClass(status, inactiveStatus);

          expect(activeClasses).not.toEqual(inactiveClasses);
        });
      });
    });

    describe('specific button transitions', () => {
      test('changing from "watched" to "watching"', () => {
        const watchedButtonClasses = getStatusButtonClass('watched', 'watched');
        const watchingButtonClasses = getStatusButtonClass('watching', 'watched');

        expect(watchedButtonClasses).toContain('cursor-default');
        expect(watchingButtonClasses).toContain('hover:opacity-80');
        expect(watchingButtonClasses).not.toContain('cursor-default');
      });

      test('changing from "watching" to "to-watch"', () => {
        const watchingButtonClasses = getStatusButtonClass('watching', 'watching');
        const toWatchButtonClasses = getStatusButtonClass('to-watch', 'watching');

        expect(watchingButtonClasses).toContain('cursor-default');
        expect(toWatchButtonClasses).toContain('hover:opacity-80');
      });

      test('changing from "to-watch" to "watched"', () => {
        const toWatchButtonClasses = getStatusButtonClass('to-watch', 'to-watch');
        const watchedButtonClasses = getStatusButtonClass('watched', 'to-watch');

        expect(toWatchButtonClasses).toContain('cursor-default');
        expect(watchedButtonClasses).toContain('hover:opacity-80');
      });
    });

    describe('yellow button special case', () => {
      test('yellow (watching) button should force black text in all states', () => {
        // Active state - watching button ACTIVE does not have !text-black (it's active so text-white applies)
        const activeWatching = getStatusButtonClass('watching', 'watching');
        expect(activeWatching).not.toContain('!text-black'); // Active is darker, no forced black

        // Inactive state - watching button INACTIVE should have forced black text for readability
        const inactiveWatching = getStatusButtonClass('watching', 'to-watch');
        expect(inactiveWatching).toContain('!text-black'); // Inactive yellow needs black text
      });

      test('other colors should not force black text', () => {
        const watchedInactive = getStatusButtonClass('watched', 'to-watch');
        expect(watchedInactive).not.toContain('!text-black');

        const toWatchInactive = getStatusButtonClass('to-watch', 'watched');
        expect(toWatchInactive).not.toContain('!text-black');
      });
    });
  });
});
