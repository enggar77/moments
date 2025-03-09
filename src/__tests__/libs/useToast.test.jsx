import { render, act, screen } from '@testing-library/react';
import { useToast } from '../../libs/useToast';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

function TestComponent() {
	const { addToast, ToastContainer } = useToast();
	return (
		<div>
			<button onClick={() => addToast('Success!', 'success')}>
				Show Toast
			</button>
			<ToastContainer />
		</div>
	);
}

describe('useToast', () => {
	beforeEach(() => {
		vi.useFakeTimers(); // Mock timers for auto-removal test
	});

	afterEach(() => {
		vi.useRealTimers(); // Restore real timers
	});

	test('adds a toast and renders it', () => {
		render(<TestComponent />);

		// Click button to trigger toast
		act(() => {
			screen.getByText('Show Toast').click();
		});

		// Expect toast to appear
		expect(screen.getByText('Success!')).toBeInTheDocument();
	});

	test('removes toast after 3 seconds', () => {
		render(<TestComponent />);

		// Click button to trigger toast
		act(() => {
			screen.getByText('Show Toast').click();
		});

		// Fast-forward time by 3 seconds
		act(() => {
			vi.advanceTimersByTime(3000);
		});

		// Expect toast to be removed
		expect(screen.queryByText('Success!')).not.toBeInTheDocument();
	});

	test('applies correct class for different toast types', () => {
		render(<TestComponent />);

		// Click button to trigger toast
		act(() => {
			screen.getByText('Show Toast').click();
		});

		// Expect toast to have the correct class
		expect(screen.getByText('Success!').parentElement).toHaveClass(
			'alert-success'
		);
	});
});
