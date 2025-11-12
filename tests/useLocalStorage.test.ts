import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/lib/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Mock localStorage
    let store: Record<string, string> = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      length: 0,
      key: vi.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    test('should initialize with provided initial value when localStorage is empty', () => {
      const initialValue = { test: 'data' };
      const { result } = renderHook(() => useLocalStorage('test-key', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });

    test('should initialize with different data types', () => {
      // String
      const stringHook = renderHook(() => useLocalStorage('string-key', 'initial'));
      expect(stringHook.result.current[0]).toBe('initial');

      // Number
      const numberHook = renderHook(() => useLocalStorage('number-key', 42));
      expect(numberHook.result.current[0]).toBe(42);

      // Array
      const arrayHook = renderHook(() => useLocalStorage('array-key', [1, 2, 3]));
      expect(arrayHook.result.current[0]).toEqual([1, 2, 3]);

      // Object
      const objectHook = renderHook(() => useLocalStorage('object-key', { a: 1 }));
      expect(objectHook.result.current[0]).toEqual({ a: 1 });
    });

    test('should return state and setter function', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'value'));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      expect(typeof result.current[1]).toBe('function');
    });
  });

  describe('state updates', () => {
    test('should update state when setter is called', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current[0]).toBe('initial');

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    test('should handle object state updates', () => {
      const initialObj = { name: 'test', count: 0 };
      const { result } = renderHook(() => useLocalStorage('test-obj', initialObj));

      const newObj = { name: 'updated', count: 1 };

      act(() => {
        result.current[1](newObj);
      });

      expect(result.current[0]).toEqual(newObj);
      expect(result.current[0].name).toBe('updated');
      expect(result.current[0].count).toBe(1);
    });

    test('should handle array state updates', () => {
      const initialArray = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage('test-array', initialArray));

      const newArray = [4, 5, 6];

      act(() => {
        result.current[1](newArray);
      });

      expect(result.current[0]).toEqual(newArray);
      expect(result.current[0].length).toBe(3);
    });
  });

  describe('persistence to localStorage', () => {
    test('should call localStorage.setItem when state changes', () => {
      const { result } = renderHook(() => useLocalStorage('persist-key', 'initial'));

      act(() => {
        result.current[1]('new value');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('persist-key', JSON.stringify('new value'));
    });

    test('should persist object as JSON string', () => {
      const initialObj = { x: 10, y: 20 };
      const { result } = renderHook(() => useLocalStorage('obj-key', initialObj));

      act(() => {
        result.current[1]({ x: 30, y: 40 });
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('obj-key', JSON.stringify({ x: 30, y: 40 }));
    });

    test('should persist array as JSON string', () => {
      const initialArray = ['a', 'b'];
      const { result } = renderHook(() => useLocalStorage('arr-key', initialArray));

      act(() => {
        result.current[1](['c', 'd', 'e']);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('arr-key', JSON.stringify(['c', 'd', 'e']));
    });

    test('should handle null values', () => {
      const { result } = renderHook(() => useLocalStorage('null-key', null));

      act(() => {
        result.current[1](null);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('null-key', JSON.stringify(null));
    });
  });

  describe('reading from localStorage', () => {
    test('should read and parse stored JSON value from localStorage', () => {
      const storedValue = { stored: 'data' };
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue(JSON.stringify(storedValue));

      const { result } = renderHook(() => useLocalStorage('existing-key', { default: 'value' }));

      expect(result.current[0]).toEqual(storedValue);
    });

    test('should fall back to initial value if localStorage key does not exist', () => {
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue(null);

      const initialValue = { initial: 'data' };
      const { result } = renderHook(() => useLocalStorage('missing-key', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });

    test('should handle stored string values', () => {
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue(JSON.stringify('stored string'));

      const { result } = renderHook(() => useLocalStorage('string-key', 'initial'));

      expect(result.current[0]).toBe('stored string');
    });

    test('should handle stored number values', () => {
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue(JSON.stringify(42));

      const { result } = renderHook(() => useLocalStorage('number-key', 0));

      expect(result.current[0]).toBe(42);
    });

    test('should handle stored array values', () => {
      const storedArray = [1, 2, 3, 4, 5];
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue(JSON.stringify(storedArray));

      const { result } = renderHook(() => useLocalStorage('array-key', []));

      expect(result.current[0]).toEqual(storedArray);
    });
  });

  describe('error handling', () => {
    test('should not crash if localStorage.getItem fails', () => {
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const initialValue = { fallback: 'value' };
      const { result } = renderHook(() => useLocalStorage('error-key', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });

    test('should not crash if localStorage.getItem returns invalid JSON', () => {
      const mockGetItem = localStorage.getItem as ReturnType<typeof vi.fn>;
      mockGetItem.mockReturnValue('invalid json {');

      const initialValue = { fallback: 'value' };
      expect(() => {
        renderHook(() => useLocalStorage('invalid-key', initialValue));
      }).not.toThrow();
    });

    test('should not crash if localStorage.setItem fails', () => {
      const mockSetItem = localStorage.setItem as ReturnType<typeof vi.fn>;
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useLocalStorage('write-error', 'initial'));

      expect(() => {
        act(() => {
          result.current[1]('new value');
        });
      }).not.toThrow();
    });
  });

  describe('SSR safety', () => {
    test('useLocalStorage works when window is available', () => {
      // This test verifies the hook doesn't break in normal SSR-safe conditions
      const initialValue = { ssr: 'data' };
      const { result } = renderHook(() => useLocalStorage('ssr-key', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });
  });

  describe('effect persistence', () => {
    test('should call localStorage.setItem to persist on state changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-persist', 'initial-value'));

      // Clear previous calls from initialization
      const mockSetItem = localStorage.setItem as ReturnType<typeof vi.fn>;
      mockSetItem.mockClear();

      act(() => {
        result.current[1]('updated-value');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('test-persist', JSON.stringify('updated-value'));
    });
  });

  describe('multiple instances', () => {
    test('should allow creating multiple independent hooks', () => {
      const hook1 = renderHook(() => useLocalStorage('key1', 'value1'));
      const hook2 = renderHook(() => useLocalStorage('key2', 'value2'));

      // Each hook should have its own independent state
      expect(hook1.result.current[0]).toBe('value1');
      expect(hook2.result.current[0]).toBe('value2');

      // Updating one should not affect the other
      act(() => {
        hook1.result.current[1]('new-value1');
      });

      expect(hook1.result.current[0]).toBe('new-value1');
      expect(hook2.result.current[0]).toBe('value2');
    });
  });

  describe('complex data structures', () => {
    test('should handle and preserve nested object structure', () => {
      const initialValue = {
        user: {
          name: 'John',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };

      const { result } = renderHook(() => useLocalStorage('nested', initialValue));

      // Verify structure is preserved
      expect(result.current[0]).toEqual(initialValue);
      expect(result.current[0].user.name).toBe('John');
      expect(result.current[0].user.preferences.theme).toBe('dark');

      // Verify updates preserve nested structure
      const mockSetItem = localStorage.setItem as ReturnType<typeof vi.fn>;
      mockSetItem.mockClear();

      const updatedValue = {
        user: {
          name: 'Jane',
          preferences: {
            theme: 'light',
            notifications: false,
          },
        },
      };

      act(() => {
        result.current[1](updatedValue);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('nested', JSON.stringify(updatedValue));
    });
  });
});
