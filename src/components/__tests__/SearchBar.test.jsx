import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from '../SearchBar';

vi.mock('react-router', () => ({
	Form: ({ children }) => <form>{children}</form>,
}));

describe('SearchBar Component', () => {
	test('renders input field with placeholder', () => {
		render(<SearchBar setSearchTerm={() => {}} />);
		const input = screen.getByPlaceholderText('Search for events...');
		expect(input).toBeInTheDocument();
	});

	test('updates input value on change', () => {
		render(<SearchBar setSearchTerm={() => {}} />);
		const input = screen.getByPlaceholderText('Search for events...');
		fireEvent.change(input, { target: { value: 'React' } });
		expect(input.value).toBe('React');
	});

	test('calls setSearchTerm with debounced value', async () => {
		const mockSetSearchTerm = vi.fn();
		render(<SearchBar setSearchTerm={mockSetSearchTerm} />);

		const input = screen.getByPlaceholderText('Search for events...');
		fireEvent.change(input, { target: { value: 'React Testing' } });

		await new Promise((resolve) => setTimeout(resolve, 600));
		expect(mockSetSearchTerm).toHaveBeenCalledWith('React Testing');
	});
});
