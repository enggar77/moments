import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useDebounce', () => ({
	default: (value) => value, // Mock debounce to return value instantly
}));

describe('SearchBar Component', () => {
	it('renders input field and search icon', () => {
		render(<SearchBar setSearchTerm={() => {}} />);

		expect(
			screen.getByPlaceholderText(/Search for events/i)
		).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('updates input value when typing', () => {
		render(<SearchBar setSearchTerm={() => {}} />);
		const input = screen.getByRole('textbox');

		fireEvent.change(input, { target: { value: 'Music' } });
		expect(input.value).toBe('Music');
	});

	it('calls setSearchTerm with the debounced value', async () => {
		const mockSetSearchTerm = vi.fn();
		render(<SearchBar setSearchTerm={mockSetSearchTerm} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Rock' } });

		// Wait for the debounce effect (mocked to run immediately)
		await waitFor(() => {
			expect(mockSetSearchTerm).toHaveBeenCalledWith('Rock');
		});
	});
});
