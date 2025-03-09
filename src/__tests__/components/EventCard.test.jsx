import { mockApi } from '../../mocks/mockApi';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '../../components/EventCard';
import { useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router';
import { useStorageUrl } from '../../libs/utils';
import {
	mockAvailability,
	mockEvent,
	mockQueuePosition,
	mockUserTicket,
} from '../../mocks/mockData';

// Mock dependencies
vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(),
}));

vi.mock('../../../convex/_generated/api', () => mockApi);

// Create an object to hold our mock data that we can modify between tests
const mockQueryResult = {
	eventData: mockEvent,
	availabilityData: mockAvailability,
	userTicketData: mockUserTicket,
	queuePositionData: mockQueuePosition,
};

vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			console.log('aieiieie', queryKey);
			if (queryKey === 'mocked_events_getById')
				return mockQueryResult.eventData;
			if (queryKey === 'mocked_events_getEventAvailability')
				return mockQueryResult.availabilityData;
			if (queryKey === 'mocked_tickets_getUserTicketForEvent')
				return mockQueryResult.userTicketData;
			if (queryKey === 'mocked_waitingList_getQueuePosition')
				return mockQueryResult.queuePositionData;
			return null;
		},
	};
});

vi.mock('react-router', () => ({
	useNavigate: vi.fn(),
	useLocation: vi.fn(),
}));

vi.mock('../../libs/utils', () => ({
	useStorageUrl: vi.fn(),
}));

vi.mock('../../components/PurchaseTicket', () => ({
	default: () => (
		<div data-testid="purchase-ticket">Purchase Ticket Component</div>
	),
}));

describe('EventCard', () => {
	const mockNavigate = vi.fn();
	const mockEventId = 'event123';

	beforeEach(() => {
		vi.clearAllMocks();

		useUser.mockReturnValue({ user: { id: 'test-user' } });
		useNavigate.mockReturnValue(mockNavigate);
		useLocation.mockReturnValue({ pathname: '/some/mock/path' });

		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = null;
		useStorageUrl.mockReturnValue('https://test-image-url.com/image.jpg');
	});

	it('renders null when event or availability data is not available', () => {
		mockQueryResult.availabilityData = null;
		const { container } = render(<EventCard eventId={mockEventId} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders event details correctly', () => {
		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('Summer Concert')).toBeInTheDocument();
		expect(screen.getByText('Central Park, New York')).toBeInTheDocument();
		expect(
			screen.getByText('A fantastic summer concert experience')
		).toBeInTheDocument();
		expect(screen.getByText('£75.00')).toBeInTheDocument();
		expect(screen.getByText('350 / 500 available')).toBeInTheDocument();
		expect(
			screen.getByText('(2 people trying to buy)')
		).toBeInTheDocument();
	});

	it('navigates to event details page when clicked', () => {
		render(<EventCard eventId={mockEventId} />);

		const card = screen.getByText('Summer Concert').closest('div.bg-white');
		fireEvent.click(card);

		expect(mockNavigate).toHaveBeenCalledWith(`/event/${mockEventId}`);
	});

	it('shows edit button for event owner', () => {
		useUser.mockReturnValue({ user: { id: mockEvent.userId } });

		render(<EventCard eventId={mockEventId} />);

		const editButton = screen.getByText('Edit Event');
		expect(editButton).toBeInTheDocument();

		fireEvent.click(editButton);
		expect(mockNavigate).toHaveBeenCalledWith(
			`/seller/events/${mockEventId}/edit`
		);
	});

	it('shows "Your Event" badge for event owner', () => {
		useUser.mockReturnValue({ user: { id: mockEvent.userId } });

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('Your Event')).toBeInTheDocument();
	});

	it('shows "Past Event" badge for events that already happened', () => {
		const pastEvent = {
			...mockEvent,
			eventDate: Date.now() - 86400000, // yesterday
		};

		mockQueryResult.eventData = pastEvent;
		mockQueryResult.availabilityData = mockAvailability;

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('Past Event')).toBeInTheDocument();
	});

	it('shows "Sold Out" badge when all tickets are purchased', () => {
		const soldOutAvailability = {
			...mockAvailability,
			purchasedCount: 500,
		};

		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = soldOutAvailability;

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('Sold Out')).toBeInTheDocument();
	});

	it('shows user ticket information when user has a ticket', () => {
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = mockUserTicket;

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('You have a ticket!')).toBeInTheDocument();

		const viewTicketButton = screen.getByText('View your ticket');
		fireEvent.click(viewTicketButton);
		expect(mockNavigate).toHaveBeenCalledWith('/tickets/ticket123');
	});

	it('shows queue position when user is in waiting list', () => {
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = null;
		mockQueryResult.queuePositionData = mockQueuePosition;

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText('Queue position')).toBeInTheDocument();
		expect(screen.getByText('#5')).toBeInTheDocument();
	});

	it('shows "next in line" message when user is in position 2', () => {
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = null;
		mockQueryResult.queuePositionData = {
			...mockQueuePosition,
			position: 2,
		};

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByText(/You're next in line!/)).toBeInTheDocument();
		expect(screen.getByText('Waiting for ticket')).toBeInTheDocument();
	});

	it('renders purchase ticket component when user has an offered ticket', () => {
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = null;
		mockQueryResult.queuePositionData = {
			...mockQueuePosition,
			status: 'offered',
		};

		render(<EventCard eventId={mockEventId} />);

		expect(screen.getByTestId('purchase-ticket')).toBeInTheDocument();
	});

	it('shows "Offer expired" message when ticket offer expired', () => {
		mockQueryResult.eventData = mockEvent;
		mockQueryResult.availabilityData = mockAvailability;
		mockQueryResult.userTicketData = null;
		mockQueryResult.queuePositionData = {
			...mockQueuePosition,
			status: 'expired',
		};

		render(<EventCard eventId={mockEventId} />);
		expect(screen.getByText('Offer expired')).toBeInTheDocument();
	});

	it('handles missing user correctly', () => {
		useUser.mockReturnValue({ user: null });

		const { container } = render(<EventCard eventId={mockEventId} />);

		// Ticket status should not be rendered
		expect(container.querySelector('.mt-4 flex items-center')).toBeNull();
	});

	it('uses default image when imageStorageId is not available', () => {
		const eventWithoutImage = { ...mockEvent, imageStorageId: null };
		mockQueryResult.eventData = eventWithoutImage;
		mockQueryResult.availabilityData = mockAvailability;

		useStorageUrl.mockReturnValue(null);

		render(<EventCard eventId={mockEventId} />);

		const img = screen.getByAltText('Summer Concert');
		expect(img.src).toContain('dreamstime.com');
	});
});
