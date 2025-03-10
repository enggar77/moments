import { mockApi } from '../../../mocks/mockApi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EventManagement from '../../../pages/admin/EventManagement';
import { mockEvents } from '../../../mocks/mockData';

// Mock api call
vi.mock('../../../../convex/_generated/api', () => mockApi);

// Mock the useQuery hook
vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			if (queryKey === 'mocked_events_get') return mockEvents;
			return null;
		},
		useMutation: () => ({}),
	};
});

// Mock Loading component
vi.mock('../../../components/Loading', () => ({
	default: () => <div data-testid="loading-indicator">Loading...</div>,
}));

describe('EventManagement', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		// Mock Date.now to return a fixed date for consistent "upcoming" status checks
		const mockDate = new Date('2025-03-09').getTime();
		vi.spyOn(Date, 'now').mockImplementation(() => mockDate);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// TO DO: add test loading state

	it('renders the table with event data', async () => {
		render(<EventManagement />);

		// Check for component title
		expect(screen.getByText('Concerts Management')).toBeInTheDocument();

		// Check for events data
		await waitFor(() => {
			expect(screen.getByText('Summer Festival')).toBeInTheDocument();
			expect(screen.getByText('Rock Concert')).toBeInTheDocument();
			// Latin Music Night should not be visible on first page due to pagination
			expect(
				screen.queryByText('Latin Music Night')
			).not.toBeInTheDocument();
		});
	});

	it('searches events by name', async () => {
		render(<EventManagement />);

		// Get the search input
		const searchInput = screen.getByPlaceholderText('Search events...');

		// Search for "Rock"
		fireEvent.change(searchInput, { target: { value: 'Rock' } });

		await waitFor(() => {
			// Rock Concert should be visible
			expect(screen.getByText('Rock Concert')).toBeInTheDocument();
			// Summer Festival should not be visible
			expect(
				screen.queryByText('Summer Festival')
			).not.toBeInTheDocument();
		});
	});

	it('displays correct event status based on date', async () => {
		render(<EventManagement />);

		await waitFor(() => {
			// Summer Festival is in the future, should show as "Upcoming"
			const upcomingEvents = screen.getAllByText('Upcoming');
			expect(upcomingEvents.length).toBeGreaterThan(0);

			// Jazz Night is in the past, should show as "Past"
			const pastEvents = screen.getAllByText('Past');
			expect(pastEvents.length).toBeGreaterThan(0);
		});
	});

	it('paginates through events', async () => {
		render(<EventManagement />);

		// First page should show first 10 events
		await waitFor(() => {
			expect(screen.getByText('Summer Festival')).toBeInTheDocument();
			expect(
				screen.queryByText('Latin Music Night')
			).not.toBeInTheDocument();
		});

		// Click next page button
		const nextButton = screen.getByText('Next');
		fireEvent.click(nextButton);

		await waitFor(() => {
			// Second page should show Latin Music Night
			expect(screen.getByText('Latin Music Night')).toBeInTheDocument();
			// First page items should no longer be visible
			expect(
				screen.queryByText('Summer Festival')
			).not.toBeInTheDocument();
		});

		// Click previous page button
		const prevButton = screen.getByText('Previous');
		fireEvent.click(prevButton);

		await waitFor(() => {
			// Back to first page
			expect(screen.getByText('Summer Festival')).toBeInTheDocument();
			expect(
				screen.queryByText('Latin Music Night')
			).not.toBeInTheDocument();
		});
	});

	it('shows correct pagination info', async () => {
		render(<EventManagement />);

		await waitFor(() => {
			// First page shows 10 of 11 entries
			expect(
				screen.getByText('Showing 10 of 11 entries')
			).toBeInTheDocument();
		});

		// Click next page button
		const nextButton = screen.getByText('Next');
		fireEvent.click(nextButton);

		await waitFor(() => {
			// Second page shows 1 of 11 entries
			expect(
				screen.getByText('Showing 1 of 11 entries')
			).toBeInTheDocument();
		});
	});

	it('disables pagination buttons appropriately', async () => {
		render(<EventManagement />);

		await waitFor(() => {
			// On first page, Previous should be disabled
			const prevButton = screen.getByText('Previous').closest('button');
			expect(prevButton).toHaveAttribute('disabled');

			// Next should be enabled (we have 11 events, so 2 pages)
			const nextButton = screen.getByText('Next').closest('button');
			expect(nextButton).not.toHaveAttribute('disabled');
		});

		// Go to second page
		const nextButton = screen.getByText('Next');
		fireEvent.click(nextButton);

		await waitFor(() => {
			// On second page, Next should be disabled
			expect(screen.getByText('Next').closest('button')).toHaveAttribute(
				'disabled'
			);
			// Previous should be enabled
			expect(
				screen.getByText('Previous').closest('button')
			).not.toHaveAttribute('disabled');
		});
	});

	it('handles search with no matching results', async () => {
		render(<EventManagement />);

		// Search for a non-existent event
		const searchInput = screen.getByPlaceholderText('Search events...');
		fireEvent.change(searchInput, {
			target: { value: 'NonExistentEvent' },
		});

		await waitFor(() => {
			// Should show "Showing 0 of 0 entries"
			expect(
				screen.getByText('Showing 0 of 0 entries')
			).toBeInTheDocument();
			// Table should be empty (except for header)
			const rows = screen.getAllByRole('row');
			// Only header row should be present
			expect(rows.length).toBe(1);
		});
	});

	it('allows pagination through numbered page buttons', async () => {
		render(<EventManagement />);

		await waitFor(() => {
			// Should have page number buttons
			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
		});

		// First page button should be active
		const page1Button = screen.getByText('1').closest('button');
		expect(page1Button).toHaveClass('btn-active');

		// Click on page 2
		const page2Button = screen.getByText('2');
		fireEvent.click(page2Button);

		await waitFor(() => {
			// Second page button should now be active
			expect(screen.getByText('2').closest('button')).toHaveClass(
				'btn-active'
			);
			// Should show Latin Music Night
			expect(screen.getByText('Latin Music Night')).toBeInTheDocument();
		});

		// Click on page 1 again
		const page1ButtonAfter = screen.getByText('1');
		fireEvent.click(page1ButtonAfter);

		await waitFor(() => {
			// First page button should be active again
			expect(screen.getByText('1').closest('button')).toHaveClass(
				'btn-active'
			);
			// Should show Summer Festival
			expect(screen.getByText('Summer Festival')).toBeInTheDocument();
		});
	});

	it('correctly formats event dates', async () => {
		render(<EventManagement />);

		await waitFor(() => {
			// Check that dates are formatted correctly
			const dateElements = screen.getAllByRole('cell');

			// Find the cell with the formatted date for Summer Festival
			const summerFestivalRow = Array.from(dateElements).find(
				(cell) => cell.textContent === 'Summer Festival'
			);

			if (summerFestivalRow) {
				// Get the next cell which should contain the date
				const dateCell = summerFestivalRow.nextSibling;
				// Check that the date is formatted as expected
				expect(dateCell.textContent).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
			}
		});
	});
});
