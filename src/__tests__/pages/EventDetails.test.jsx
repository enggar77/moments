import { mockApi } from '../../mocks/mockApi';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventDetails from '../../pages/EventDetails';
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router';
import {
	mockAvailability,
	mockEvent,
	soldOutAvailability,
	noDescriptionEvent,
} from '../../mocks/mockData';

// Mock the necessary modules
vi.mock('react-router', () => ({
	useParams: vi.fn(),
}));

vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(),
	SignInButton: ({ children }) => (
		<div data-testid="sign-in-button">{children}</div>
	),
}));

vi.mock('../../../convex/_generated/api', () => mockApi);

// Create an object to hold our mock data that we can modify between tests
const mockQueryResult = {
	eventData: mockEvent,
	availabilityData: mockAvailability,
};

// Mock convex/react with our modifiable mock data
vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			if (queryKey === 'mocked_events_getById')
				return mockQueryResult.eventData;
			if (queryKey === 'mocked_events_getEventAvailability')
				return mockQueryResult.availabilityData;
			return null;
		},
	};
});

vi.mock('../../components/Loading', () => ({
	default: () => <div data-testid="loading-indicator">Loading...</div>,
}));

vi.mock('../../components/EventCard', () => ({
	default: ({ eventId }) => (
		<div data-testid="event-card">Event Card for {eventId}</div>
	),
}));

vi.mock('../../components/JoinQueue', () => ({
	default: ({ eventId, userId }) => (
		<div data-testid="join-queue">
			Join Queue Component for event {eventId} and user {userId}
		</div>
	),
}));

vi.mock('../../components/Button', () => ({
	default: ({ children, className }) => (
		<button className={className} data-testid="button">
			{children}
		</button>
	),
}));

describe('EventDetails', async () => {
	beforeEach(() => {
		vi.resetAllMocks();

		// Mock useParams to return a fixed event ID
		useParams.mockReturnValue({ id: 'event123' });

		// Default to not logged in
		useUser.mockReturnValue({ user: null, isSignedIn: false });

		// Reset mock data to default values before each test
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
	});

	it('shows loading state when data is being fetched', () => {
		// Set mock data to null to simulate loading state
		mockQueryResult.eventData = null;
		mockQueryResult.availabilityData = null;

		render(<EventDetails />);

		expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
	});

	it('renders event details correctly when data is loaded', async () => {
		render(<EventDetails />);

		// Check if event details are rendered correctly
		expect(screen.getByText('Summer Concert')).toBeInTheDocument();
		expect(
			screen.getByText('A fantastic summer concert experience')
		).toBeInTheDocument();
		expect(screen.getByText('Central Park, New York')).toBeInTheDocument();
		expect(screen.getByText('£75.00')).toBeInTheDocument();
		expect(screen.getByText('350 / 500 left')).toBeInTheDocument();

		// Check for the event information section
		expect(screen.getByText('Event Information')).toBeInTheDocument();
		expect(
			screen.getByText(
				'• Please arrive 30 minutes before the event starts'
			)
		).toBeInTheDocument();
	});

	it('shows sign-in button when user is not logged in', async () => {
		// User is already set to not logged in in beforeEach

		render(<EventDetails />);

		// Check if sign-in button is rendered
		expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
		expect(screen.getByText('Sign in to buy tickets')).toBeInTheDocument();
		expect(screen.queryByTestId('join-queue')).not.toBeInTheDocument();
	});

	it('shows JoinQueue component when user is logged in', async () => {
		// Set user to logged in
		useUser.mockReturnValue({
			user: { id: 'user123', fullName: 'Test User' },
			isSignedIn: true,
		});

		render(<EventDetails />);

		// Check if JoinQueue component is rendered with correct props
		expect(screen.getByTestId('join-queue')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Join Queue Component for event event123 and user user123'
			)
		).toBeInTheDocument();
		expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
	});

	it('formats the date correctly', async () => {
		render(<EventDetails />);

		// Check for formatted date (implementation might vary based on locale)
		// This is a loose check that should work regardless of locale format
		const dateText = screen.getByText(
			/(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})|(\d{2,4}[/.-]\d{1,2}[/.-]\d{1,2})/
		);
		expect(dateText).toBeInTheDocument();
	});

	it('renders the EventCard component with correct eventId', async () => {
		render(<EventDetails />);

		// Check if EventCard is rendered with correct props
		expect(screen.getByTestId('event-card')).toBeInTheDocument();
		expect(screen.getByText('Event Card for event123')).toBeInTheDocument();
	});

	it('handles an event with zero availability correctly', async () => {
		// Update to sold out availability
		mockQueryResult.availabilityData = soldOutAvailability;

		render(<EventDetails />);

		// Check if availability shows as sold out
		expect(screen.getByText('0 / 500 left')).toBeInTheDocument();
	});

	it('displays the correct price format', async () => {
		render(<EventDetails />);

		// Check if price is formatted correctly
		expect(screen.getByText('£75.00')).toBeInTheDocument();
	});

	it('handles events with no description gracefully', async () => {
		// Update to event with no description
		mockQueryResult.eventData = noDescriptionEvent;

		render(<EventDetails />);

		// Component should still render properly without description
		expect(screen.getByText('Summer Concert')).toBeInTheDocument();
		// The description element should be empty but present
		const paragraphs = screen.getAllByText('');
		expect(
			paragraphs.some((p) => p.className.includes('text-gray-600'))
		).toBeTruthy();
	});
});
