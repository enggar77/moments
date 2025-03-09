import { render, screen } from '@testing-library/react';
import Error from '../../components/Error';
import { useRouteError } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock react-router
vi.mock('react-router', () => ({
	useRouteError: vi.fn(),
	Link: ({ to, children }) => (
		<a data-testid="link" href={to}>
			{children}
		</a>
	),
}));

// Mock Button component
vi.mock('../../components/Button', () => ({
	default: ({ children, onClick }) => (
		<button onClick={onClick}>{children}</button>
	),
}));

// Mock console.log to prevent test output pollution
console.log = vi.fn();

describe('Error Component', () => {
	beforeEach(() => {
		// Reset mocks before each test
		vi.resetAllMocks();
		// Default mock error
		useRouteError.mockReturnValue({ message: 'Test error message' });
	});

	it('should render the error message correctly', () => {
		render(<Error />);

		expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
		expect(screen.getByText('Test error message')).toBeInTheDocument();
		expect(screen.getByText('Go back to homepage')).toBeInTheDocument();
	});

	it('should display data property if present', () => {
		useRouteError.mockReturnValue({
			data: 'Error data message',
			message: 'Regular error message',
		});

		render(<Error />);

		expect(screen.getByText('Error data message')).toBeInTheDocument();
		expect(
			screen.queryByText('Regular error message')
		).not.toBeInTheDocument();
	});

	it('should include a link back to the homepage', () => {
		render(<Error />);

		const homeLink = screen.getByTestId('link');
		expect(homeLink).toHaveAttribute('href', '/');
	});

	it('should log the error to console', () => {
		const mockError = { message: 'Console logged error' };
		useRouteError.mockReturnValue(mockError);

		render(<Error />);

		expect(console.log).toHaveBeenCalledWith(mockError);
	});
});
