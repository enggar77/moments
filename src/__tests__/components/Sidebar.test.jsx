import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';

// Mock the react-router imports
vi.mock('react-router', () => ({
	Link: ({ to, className, children }) => (
		<a
			href={to}
			className={className}
			data-testid={`link-${to.replace(/\//g, '-').substring(1)}`}
		>
			{children}
		</a>
	),
	useLocation: vi.fn(),
}));

// Mock the Lucide React icons
vi.mock('lucide-react', () => ({
	LineChart: () => <span data-testid="icon-linechart">LineChart</span>,
	Music: () => <span data-testid="icon-music">Music</span>,
	Ticket: () => <span data-testid="icon-ticket">Ticket</span>,
	Users: () => <span data-testid="icon-users">Users</span>,
	X: () => <span data-testid="icon-x">X</span>,
	Menu: () => <span data-testid="icon-menu">Menu</span>,
}));

import { useLocation } from 'react-router';

describe('Sidebar Component', () => {
	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useLocation.mockReturnValue({ pathname: '/dashboard' });
	});

	it('renders closed sidebar correctly on mobile', () => {
		render(<Sidebar isOpen={false} onClose={mockOnClose} />);

		// Sidebar should have translate-x-full class (hidden on mobile)
		const sidebar = screen
			.getByText('Admin Dashboard')
			.closest('div').parentElement;
		expect(sidebar).toHaveClass('-translate-x-full');
		expect(sidebar).not.toHaveClass('translate-x-0');

		// Overlay should not be present
		const overlay = screen.queryByText('', {
			selector: 'div.fixed.inset-0',
		});
		expect(overlay).not.toBeInTheDocument();
	});

	it('renders open sidebar correctly on mobile', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		// Sidebar should have translate-x-0 class (visible)
		const sidebar = screen
			.getByText('Admin Dashboard')
			.closest('div').parentElement;
		expect(sidebar).toHaveClass('translate-x-0');
		expect(sidebar).not.toHaveClass('-translate-x-full');

		// Overlay should be present
		const overlay = screen.getByText('', { selector: 'div.fixed.inset-0' });
		expect(overlay).toBeInTheDocument();
	});

	it('calls onClose when X button is clicked', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		const closeButton = screen.getByTestId('icon-x').closest('button');
		fireEvent.click(closeButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when overlay is clicked', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		const overlay = screen.getByText('', { selector: 'div.fixed.inset-0' });
		fireEvent.click(overlay);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('highlights the active link based on current pathname', () => {
		useLocation.mockReturnValue({ pathname: '/dashboard/events' });

		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		// Dashboard link should not be highlighted
		const dashboardLink = screen.getByTestId('link-dashboard');
		expect(dashboardLink).not.toHaveClass('border-b-2');
		expect(dashboardLink).not.toHaveClass('border-[#FAB700]');

		// Events link should be highlighted
		const eventsLink = screen.getByTestId('link-dashboard-events');
		expect(eventsLink).toHaveClass('border-b-2');
		expect(eventsLink).toHaveClass('border-[#FAB700]');
		expect(eventsLink).toHaveClass('text-[#FAB700]');
	});

	it('renders all navigation links with correct URLs', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		// Check all links are present with correct URLs
		expect(screen.getByTestId('link-dashboard')).toHaveAttribute(
			'href',
			'/dashboard'
		);
		expect(screen.getByTestId('link-dashboard-events')).toHaveAttribute(
			'href',
			'/dashboard/events'
		);
		expect(
			screen.getByTestId('link-dashboard-transactions')
		).toHaveAttribute('href', '/dashboard/transactions');
		expect(screen.getByTestId('link-dashboard-users')).toHaveAttribute(
			'href',
			'/dashboard/users'
		);
	});

	it('renders all icons correctly', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		// Check all icons are present
		expect(screen.getByTestId('icon-linechart')).toBeInTheDocument();
		expect(screen.getByTestId('icon-music')).toBeInTheDocument();
		expect(screen.getByTestId('icon-ticket')).toBeInTheDocument();
		expect(screen.getByTestId('icon-users')).toBeInTheDocument();
		expect(screen.getByTestId('icon-x')).toBeInTheDocument();
	});

	it('has correct styling for different viewports', () => {
		render(<Sidebar isOpen={true} onClose={mockOnClose} />);

		const sidebar = screen
			.getByText('Admin Dashboard')
			.closest('div').parentElement;

		// Check mobile specific classes
		expect(sidebar).toHaveClass('md:translate-x-0');

		// Check shared classes for styling
		expect(sidebar).toHaveClass('bg-[#222222]');
		expect(sidebar).toHaveClass('w-64');
		expect(sidebar).toHaveClass('shadow-lg');
	});
});
