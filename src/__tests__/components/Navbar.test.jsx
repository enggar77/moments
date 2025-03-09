import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import {
	useClerk,
	useUser,
} from '@clerk/clerk-react';
import { useQuery } from 'convex/react';

// Import router asli agar `MemoryRouter` bisa digunakan
import * as ReactRouterDom from 'react-router';

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
	useClerk: vi.fn(() => ({
		openSignIn: vi.fn(), // Pastikan openSignIn tidak undefined
	})),
	useUser: vi.fn(() => ({
		user: null,
		isLoaded: true,
	})),
	SignedIn: ({ children }) => <>{children}</>,
	SignedOut: ({ children }) => <>{children}</>,
	UserButton: vi.fn(() => <div data-testid="user-button">User Button</div>),
}));

// Mock Convex
vi.mock('convex/react', () => ({
	useQuery: vi.fn(),
}));

// Mock React Router, tetapi tetap gunakan `MemoryRouter` dari versi asli
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useLocation: vi.fn(),
		Link: ({ to, children }) => <a href={to}>{children}</a>,
	};
});

describe('Navbar Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		ReactRouterDom.useLocation.mockReturnValue({ pathname: '/' });
	});

	test('renders Sign In button when user is not signed in', () => {
		useUser.mockReturnValue({ user: null, isLoaded: true });
		useQuery.mockReturnValue(null);

		render(<Navbar />, { wrapper: ReactRouterDom.MemoryRouter });

		expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
	});

	test('calls openSignIn when Sign In button is clicked', () => {
		const mockOpenSignIn = vi.fn();
		useClerk.mockReturnValue({ openSignIn: mockOpenSignIn });
		useUser.mockReturnValue({ user: null, isLoaded: true });

		render(<Navbar />, { wrapper: ReactRouterDom.MemoryRouter });

		fireEvent.click(screen.getByText(/Sign In/i));
		expect(mockOpenSignIn).toHaveBeenCalled();
	});
});
