import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PurchaseTicket from '../PurchaseTicket';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { useLocation } from 'react-router';

vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(),
}));

vi.mock('convex/react', () => ({
	useQuery: vi.fn(),
	useMutation: vi.fn(() => vi.fn()), // ✅ Pastikan useMutation dimock sebagai fungsi
}));

vi.mock('react-router', () => ({
	useLocation: vi.fn(() => ({ pathname: '/event/123' })),
	useNavigate: vi.fn(),
}));

describe('PurchaseTicket Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('does not render if user is not logged in', () => {
		useUser.mockReturnValue({ user: null });
		useQuery.mockReturnValue(null);
		useLocation.mockReturnValue({ pathname: '/event/123' });

		render(<PurchaseTicket eventId="123" />);
		expect(screen.queryByText(/ticket reserved/i)).not.toBeInTheDocument();
	});

	test('renders ticket reservation when status is offered', () => {
		useUser.mockReturnValue({ user: { id: 'user123' } });
		useQuery.mockReturnValue({
			status: 'offered',
			offerExpiresAt: Date.now() + 60000,
			_id: 'queue123',
		});
		useLocation.mockReturnValue({ pathname: '/event/123' });

		render(<PurchaseTicket eventId="123" />);
		expect(screen.getByText(/ticket reserved/i)).toBeInTheDocument();
	});

	test('disables purchase button when expired', () => {
		useUser.mockReturnValue({ user: { id: 'user123' } });
		useQuery.mockReturnValue({
			status: 'offered',
			offerExpiresAt: Date.now() - 1000,
			_id: 'queue123',
		});
		useLocation.mockReturnValue({ pathname: '/event/123' });

		render(<PurchaseTicket eventId="123" />);
		const button = screen.getByRole('button', {
			name: /purchase your ticket now/i,
		});
		expect(button).toBeDisabled();
	});
});
