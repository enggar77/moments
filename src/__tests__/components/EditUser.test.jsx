import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUser from '../../components/EditUser'; // Your component
import Swal from 'sweetalert2'; // Import SweetAlert2
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useMutation: () => ({}),
	};
});

vi.mock('sweetalert2', () => {
	return {
		default: {
			fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
		},
	};
});

describe('EditUser Component', () => {
	let setIsOpen;
	let user;

	beforeEach(() => {
		setIsOpen = vi.fn(); // Mock the setIsOpen function
		user = {
			_id: '123',
			name: 'John Doe',
			email: 'johndoe@example.com',
			role: 'user',
		};
	});

	it('should call setIsOpen when Swal is confirmed', async () => {
		render(<EditUser setIsOpen={setIsOpen} user={user} />);

		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		// Wait for Swal.fire to be called
		await waitFor(() => expect(Swal.fire).toHaveBeenCalled());

		// Expect Swal.fire to be called twice - once for confirmation and once for success
		expect(Swal.fire).toHaveBeenCalledTimes(2);

		// Ensure setIsOpen is called after confirmation
		expect(setIsOpen).toHaveBeenCalledWith(false);
	});
});
