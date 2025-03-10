import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import MyTickets from '../../pages/MyTickets';

describe('MyTickets Component', () => {
	beforeEach(() => {
		render(<MyTickets />);
	});

	it('should render the My Tickets title', () => {
		expect(screen.getByText('My Tickets')).toBeInTheDocument();
	});

	it('should display ticket descriptions', () => {
		expect(
			screen.getByText('Manage your upcoming events')
		).toBeInTheDocument();
	});

	it('should render all ticket cards', () => {
		expect(
			screen.getByText('Taylor Swift: The Eras Tour')
		).toBeInTheDocument();
		expect(screen.getByText('Aurora: World Tour')).toBeInTheDocument();
		expect(
			screen.getByText('Twenty One Pilots: Clancy Tour')
		).toBeInTheDocument();
	});
});
