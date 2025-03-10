import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Overview from '../../pages/admin/Overview';

describe('Overview Component', () => {
	beforeEach(() => {
		render(<Overview />);
	});

	it('should render the Overview title', () => {
		expect(screen.getByText('Overview')).toBeInTheDocument();
	});

	it('should display all statistics cards', () => {
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('Tickets Sold')).toBeInTheDocument();
		expect(screen.getByText('Active Events')).toBeInTheDocument();
	});

	it('should render the Recent Activity table', () => {
		expect(screen.getByText('Recent Activity')).toBeInTheDocument();
		expect(screen.getByText('Date')).toBeInTheDocument();
		expect(screen.getByText('User')).toBeInTheDocument();
		expect(screen.getByText('Action')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
	});

	it('should display activity rows', () => {
		expect(screen.getByText('Albus Dumbledore')).toBeInTheDocument();
		expect(screen.getByText('Tom Riddle')).toBeInTheDocument();
		expect(screen.getByText('Harry Potter')).toBeInTheDocument();
	});
});
