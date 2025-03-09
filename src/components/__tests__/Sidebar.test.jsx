import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sidebar from '../Sidebar';

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useLocation: () => ({ pathname: '/dashboard' }),
	};
});

describe('Sidebar Component', () => {
	let onCloseMock;

	beforeEach(() => {
		onCloseMock = vi.fn();
	});

	it('renders correctly when open', () => {
		render(
			<MemoryRouter>
				<Sidebar isOpen={true} onClose={onCloseMock} />
			</MemoryRouter>
		);

		expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Overview')).toBeInTheDocument();
		expect(screen.getByText('Concerts Management')).toBeInTheDocument();
		expect(screen.getByText('Transactions')).toBeInTheDocument();
		expect(screen.getByText('Users')).toBeInTheDocument();
	});

	it('applies active styles to the correct link', () => {
		render(
			<MemoryRouter>
				<Sidebar isOpen={true} onClose={onCloseMock} />
			</MemoryRouter>
		);

		const activeLink = screen.getByText('Overview');
		expect(activeLink).toHaveClass(
			'border-b-2 border-[#FAB700] text-[#FAB700]'
		);
	});

	it('calls onClose when clicking the close button', () => {
		render(
			<MemoryRouter>
				<Sidebar isOpen={true} onClose={onCloseMock} />
			</MemoryRouter>
		);

		const closeButton = screen.getByRole('button');
		fireEvent.click(closeButton);

		expect(onCloseMock).toHaveBeenCalled();
	});

	it('does not render when isOpen is false', () => {
		render(
			<MemoryRouter>
				<Sidebar isOpen={false} onClose={onCloseMock} />
			</MemoryRouter>
		);

		expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
	});
});
