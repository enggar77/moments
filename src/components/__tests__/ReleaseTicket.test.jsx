import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ReleaseTicket from '../ReleaseTicket';

// Buat mock untuk useMutation
const mockReleaseTicket = vi.fn();

vi.mock('convex/react', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useMutation: () => mockReleaseTicket,
	};
});

describe('ReleaseTicket Component', () => {
	beforeEach(() => {
		vi.clearAllMocks(); // Pastikan mock bersih sebelum setiap test
	});

	test('renders button with correct text', () => {
		render(<ReleaseTicket eventId="123" waitingListId="456" />);
		const button = screen.getByRole('button', {
			name: /release ticket offer/i,
		});
		expect(button).toBeInTheDocument();
	});

	test('shows confirmation before releasing ticket', () => {
		global.confirm = vi.fn().mockReturnValue(false);
		render(<ReleaseTicket eventId="123" waitingListId="456" />);

		const button = screen.getByRole('button', {
			name: /release ticket offer/i,
		});
		fireEvent.click(button);

		expect(global.confirm).toHaveBeenCalledWith(
			'Are you sure you want to release your ticket offer?'
		);
	});

	test('calls releaseTicket mutation when confirmed', async () => {
		global.confirm = vi.fn().mockReturnValue(true);
		mockReleaseTicket.mockResolvedValue();

		render(<ReleaseTicket eventId="123" waitingListId="456" />);

		const button = screen.getByRole('button', {
			name: /release ticket offer/i,
		});
		fireEvent.click(button);

		await waitFor(() =>
			expect(mockReleaseTicket).toHaveBeenCalledWith({
				eventId: '123',
				waitingListId: '456',
			})
		);
	});

	test('disables button while releasing', async () => {
		global.confirm = vi.fn().mockReturnValue(true);
		mockReleaseTicket.mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 500))
		);

		render(<ReleaseTicket eventId="123" waitingListId="456" />);

		const button = screen.getByRole('button', {
			name: /release ticket offer/i,
		});
		fireEvent.click(button);

		await waitFor(() => expect(button).toBeDisabled());
	});
});
