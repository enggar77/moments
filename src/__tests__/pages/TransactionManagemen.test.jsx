import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import TransactionManagement from '../../pages/TransactionManagement';

describe('TransactionManagement Component', () => {
	beforeEach(() => {
		render(<TransactionManagement />);
	});

	it('should render the component correctly', () => {
		expect(screen.getByText('Transactions Management')).toBeInTheDocument();
	});

	it('should filter transactions by search input', () => {
		const searchInput = screen.getByPlaceholderText(
			'Search transactions...'
		);
		fireEvent.change(searchInput, { target: { value: 'Harry' } });

		expect(screen.getByText('Harry potter')).toBeInTheDocument();
		expect(screen.queryByText('Albus Dumbledore')).not.toBeInTheDocument();
	});

	it('should filter transactions by status', () => {
		const statusSelect = screen.getByRole('combobox');
		fireEvent.change(statusSelect, { target: { value: 'Pending' } });

		expect(screen.getByText('Tom Riddle')).toBeInTheDocument();
		expect(screen.queryByText('Albus Dumbledore')).not.toBeInTheDocument();
		expect(screen.queryByText('Harry potter')).not.toBeInTheDocument();
	});

	it('should render transaction data correctly', () => {
		expect(screen.getByText('#TRX-2025001')).toBeInTheDocument();
		expect(screen.getByText('Rock Festival 2025')).toBeInTheDocument();
		expect(screen.getByText('$89.00')).toBeInTheDocument();
	});
});
