import { render, screen } from '@testing-library/react';
import TicketCard from '../TicketCard';
import { describe, it, expect } from 'vitest';

const mockData = {
	name: 'Concert XYZ',
	type: 'VIP',
	date: '2025-03-10',
	time: '19:00',
	location: 'Jakarta Stadium',
	seat: 'A12',
};

describe('TicketCard Component', () => {
	it('renders ticket details correctly', () => {
		render(<TicketCard data={mockData} />);

		expect(screen.getByText(mockData.name)).toBeInTheDocument();
		expect(screen.getByText(mockData.type)).toBeInTheDocument();
		expect(screen.getByText(mockData.date)).toBeInTheDocument();
		expect(screen.getByText(mockData.time)).toBeInTheDocument();
		expect(screen.getByText(mockData.location)).toBeInTheDocument();
		expect(screen.getByText(`Seat: ${mockData.seat}`)).toBeInTheDocument();
	});

	it('renders download and view ticket buttons', () => {
		render(<TicketCard data={mockData} />);

		expect(screen.getByText('Download')).toBeInTheDocument();
		expect(screen.getByText('View Ticket')).toBeInTheDocument();
	});
});
