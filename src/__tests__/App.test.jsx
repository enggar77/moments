import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
const convexUrl = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

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

		expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
	});
});
