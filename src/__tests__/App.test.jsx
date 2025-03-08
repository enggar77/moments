import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import { api } from '../../convex/_generated/api';
const convexUrl = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

// Mock the Clerk provider and hooks
vi.mock('@clerk/clerk-react', () => {
	return {
		ClerkProvider: ({ children }) => children,
		useUser: () => ({
			isLoaded: true,
			user: {
				id: 'test_user_id',
			},
		}),
	};
});

vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey, params) => {
			// Mock user role query buat Dashboard
			if (queryKey === api.users.getUser) {
				return { role: 'admin' }; // Selalu return role admin
			}

			// Mock events query buat Home
			if (queryKey === api.events.get) {
				return [
					{ id: 1, name: 'Event 1' },
					{ id: 2, name: 'Event 2' },
				];
			}

			// Default: Balikin null biar gak undefined
			return null;
		},
	};
});


describe('App Routing', () => {
	/** Ensure tests are wrapped with ConvexProvider */
	const renderWithRouter = (initialRoute) => {
		const testRouter = createMemoryRouter(
			[
				{ path: '/', element: <Home /> },
				{ path: '/dashboard', element: <Dashboard /> },
			],
			{ initialEntries: [initialRoute] }
		);

		return render(
			<ConvexProvider client={convex}>
				<RouterProvider router={testRouter} />
			</ConvexProvider>
		);
	};

	it('renders Home page on default route', () => {
		renderWithRouter('/');

		expect(screen.getByText(/Get Tickets/i)).toBeInTheDocument();
	});

	it('renders Dashboard when navigating to /dashboard', () => {
		renderWithRouter('/dashboard');

		expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
	});
});
