import { mockApi } from '../mocks/mockApi';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Layout from '../components/Layout';
import Error from '../components/Error';
import Home from '../pages/Home';
import Dashboard from '../pages/admin/Dashboard';
import Overview from '../pages/admin/Overview';
import EventManagement from '../pages/admin/EventManagement';
import UserManagement from '../pages/admin/UserManagement';
import TransactionManagement from '../pages/admin/TransactionManagement';
import MyTickets from '../pages/user/MyTickets';
import EventDetails from '../pages/EventDetails';
import SearchPage from '../pages/SearchPage';
import { mockAvailability, mockEvent, mockUser } from '../mocks/mockData';
import TicketPage from '../pages/user/TicketPage';
import Seller from '../pages/seller/Seller';
import EventForm from '../components/feature/create-event/EventForm';
import SellerEvents from '../pages/seller/SellerEvents';
import PurchaseSuccess from '../pages/user/PurchaseSuccess';
import EditEvent from '../components/feature/create-event/EditEvent';

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

// Mock api call
vi.mock('../../convex/_generated/api', () => mockApi);

// Mock Convex hooks
vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			if (queryKey === 'mocked_users_getUser') return mockUser;
			if (queryKey === 'mocked_events_getEventAvailability')
				return mockAvailability;
			if (queryKey === 'mocked_events_getById') return mockEvent;
			if (
				['mocked_users_getAllUsers', 'mocked_events_get'].includes(
					queryKey
				)
			)
				return [];

			return [];
		},
		useMutation: () => ({}),
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
					// Home
					{ path: '/', element: <Home /> },
					{
						path: '/',
						element: <SearchPage />,
					},
					// User
					{ path: '/ticket/:id', element: <MyTickets /> },
					{
						path: '/ticket/:id',
						element: <TicketPage />,
					},
					{
						path: 'ticket/purchase-success',
						element: <PurchaseSuccess />,
					},

					// Seller / Organizer
					{
						path: '/seller',
						element: <Seller />,
					},
					{
						path: '/connect/return/:accountId',
						element: <Seller />,
					},
					{
						path: '/connect/refresh/:accountId',
						element: <Seller />,
					},
					{
						path: '/seller/create-event',
						element: <EventForm />,
					},
					{
						path: '/seller/my-events',
						element: <SellerEvents />,
					},
					{
						path: '/seller/events/:id/edit',
						element: <EditEvent />,
					},

					// EVENT DETAILS
					{
						path: '/event/:id',
						element: <EventDetails />,
					},
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
	// it('renders Home page by default', () => {
	// 	renderWithRouter('/');
	// 	expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();
	// });

	it('renders MyTickets page when navigating to /ticket/:id', () => {
		renderWithRouter('/ticket/123');
		expect(screen.getByText(/My Tickets/i)).toBeInTheDocument();
	});

	it('renders EditEvent page when navigating to /seller/events/:eventId/edit', async () => {
		renderWithRouter('/seller/events/1/edit');
		expect(screen.getByText(/Update Event/i)).toBeInTheDocument();
	});

	it('renders Event Details page when navigating to /event/:id', () => {
		renderWithRouter('/event/123');
		expect(screen.getByText(/Event Information/i)).toBeInTheDocument();
	});

	// it('renders Seller Dashboard when navigating to /seller', () => {
	// 	renderWithRouter('/seller');
	// 	expect(screen.getByText(/Seller Dashboard/i)).toBeInTheDocument();
	// });
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
			screen.getByRole('heading', { name: /Concerts Management/i })
		).toBeInTheDocument();
	});

	it('renders User Management page', () => {
		renderWithRouter('/dashboard/users');
		const tableText = screen.getByRole('table').textContent;
		expect(tableText).toMatch(/User|Email|Role|Actions/);
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
