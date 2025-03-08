import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useDebounce from '../../hooks/useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers(); // Mock timers
	});

	afterEach(() => {
		vi.clearAllTimers(); // Cleanup timers
		vi.useRealTimers(); // Restore real timers
	});

	it('should return the initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('hello', 500));
		expect(result.current).toBe('hello');
	});

	it('should update value after the delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{
				initialProps: { value: 'hello' },
			}
		);

		// Update the value
		rerender({ value: 'world' });

		// Value should not change immediately
		expect(result.current).toBe('hello');

		// Fast-forward time by 500ms
		act(() => {
			vi.advanceTimersByTime(500);
		});

		// Now the value should be updated
		expect(result.current).toBe('world');
	});

	it('should reset debounce timer if value changes before delay ends', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{
				initialProps: { value: 'hello' },
			}
		);

		rerender({ value: 'world' });

		// Fast-forward time by 300ms (less than the delay)
		act(() => {
			vi.advanceTimersByTime(300);
		});

		// Value should still be 'hello' since debounce hasn't completed
		expect(result.current).toBe('hello');

		// Change value before previous debounce completes
		rerender({ value: 'vitest' });

		// Fast-forward time by 500ms
		act(() => {
			vi.advanceTimersByTime(500);
		});

		// Now the value should be updated to 'vitest'
		expect(result.current).toBe('vitest');
	});
});
