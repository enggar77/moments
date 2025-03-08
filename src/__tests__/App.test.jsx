import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Layout from '../components/Layout';
import Error from '../components/Error';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Overview from '../pages/Overview';
import EventManagement from '../pages/admin/EventManagement';
import UserManagement from '../pages/admin/UserManagement';
import TransactionManagement from '../pages/TransactionManagement';
import { api } from '../../convex/_generated/api';
import AddEvent from '../pages/AddEvent';
import MyTickets from '../pages/MyTickets';
import EditEvent from '../pages/EditEvent';
import EventDetails from '../pages/EventDetails';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
	ClerkProvider: ({ children }) => children,
	useUser: () => ({ isLoaded: true, user: { id: 'test_user_id' } }),
	useClerk: () => ({}),
	SignedIn: ({ children }) => <>{children}</>,
	SignedOut: ({ children }) => <>{children}</>,
	UserButton: () => <div data-testid="user-button" />,
}));

// Mock Convex hooks
vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			if (queryKey === api.users.getUser) return { role: 'admin' };
			if (queryKey === api.events.get)
				return [{ id: 1, name: 'Event 1' }];
			// add query event details
			return null;
		},
	};
});

// Single Router Setup
const createRouter = (initialRoute) =>
	createMemoryRouter(
		[
			{
				element: <Layout />,
				errorElement: <Error />,
				children: [
					{ path: '/', element: <Home /> },
					{ path: '/ticket/:id', element: <MyTickets /> },
					{ path: '/sell', element: <AddEvent /> },
					{
						path: '/seller/events/:eventId/edit',
						element: <EditEvent />,
					},
					{ path: '/event/:id', element: <EventDetails /> },
					{
						path: '/dashboard',
						element: <Dashboard />,
						children: [
							{ path: '/dashboard', element: <Overview /> },
							{
								path: '/dashboard/events',
								element: <EventManagement />,
							},
							{
								path: '/dashboard/users',
								element: <UserManagement />,
							},
							{
								path: '/dashboard/transactions',
								element: <TransactionManagement />,
							},
						],
					},
				],
			},
		],
		{ initialEntries: [initialRoute] }
	);

const renderWithRouter = (route) =>
	render(
		<ConvexProvider client={convex}>
			<RouterProvider router={createRouter(route)} />
		</ConvexProvider>
	);

describe('App Routing', () => {
	it('renders Home page by default', () => {
		renderWithRouter('/');
		expect(screen.getByText(/Get Tickets/i)).toBeInTheDocument();
	});

	it('renders MyTickets page when navigating to /ticket/:id', () => {
		renderWithRouter('/ticket/123');
		expect(screen.getByText(/My Tickets/i)).toBeInTheDocument();
	});

	it('renders EditEvent page when navigating to /seller/events/:eventId/edit', async () => {
		renderWithRouter('/seller/events/1/edit');
		expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
	});

	// add test for EventDetails

	it('renders Add Event page when navigating to /sell', () => {
		renderWithRouter('/sell');
		expect(screen.getByText(/Add New Event/i)).toBeInTheDocument();
	});
});

describe('Dashboard Routing', () => {
	beforeEach(() => {
		renderWithRouter('/dashboard');
	});

	it('renders the Dashboard layout', () => {
		expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
	});

	it('renders Overview by default', () => {
		expect(
			screen.getByRole('heading', { name: /Overview/i })
		).toBeInTheDocument();
	});
});

describe('Admin Pages in Dashboard', () => {
	it('renders Event Management page', () => {
		renderWithRouter('/dashboard/events');
		expect(
			screen.getByText(/Showing \d+ of \d+ entries/i)
		).toBeInTheDocument();
	});

	it('renders User Management page', () => {
		renderWithRouter('/dashboard/users');
		const tableText = screen.getByRole('table').textContent;
		expect(tableText).toMatch(
			/User|Email|Registration Date|Purchases|Status|Actions/
		);
	});

	it('renders Transaction Management page', () => {
		renderWithRouter('/dashboard/transactions');
		expect(
			screen.getByText(/Transactions Management/i)
		).toBeInTheDocument();
	});
});

describe('Unknown Address', () => {
	it('renders the Error page for unknown routes', () => {
		renderWithRouter('/unknown');
		expect(screen.getByText(/No route matches URL/i)).toBeInTheDocument();
	});
});
