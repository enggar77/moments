import { mockApi } from '../../../mocks/mockApi';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockUsers } from '../../../mocks/mockData';
import UserManagement from '../../../pages/admin/UserManagement';

// Mock api call
vi.mock('../../../../convex/_generated/api', () => mockApi);

vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			if (queryKey === 'mocked_users_getAllUsers') return mockUsers;
			return [];
		},
		useMutation: () => ({}),
	};
});

vi.mock('../../../components/SearchBar.jsx', () => ({
	default: ({ setSearchTerm, placeholder }) => (
		<input
			data-testid="search-bar"
			placeholder={placeholder}
			onChange={(e) => setSearchTerm(e.target.value)}
		/>
	),
}));

vi.mock('../../../components/EditUser.jsx', () => ({
	default: ({ setIsOpen, user }) => (
		<div data-testid="edit-user-modal">
			Editing user: {user.name}
			<button onClick={() => setIsOpen(false)} data-testid="close-modal">
				Close
			</button>
		</div>
	),
}));

describe('UserManagement', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	// TO DO: add test loading state

	it('renders the table with user data', () => {
		// Mock useQuery to return user data after the loading state
		render(<UserManagement />);

		expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		expect(screen.getByText('Jack Ryan')).toBeInTheDocument();
		expect(screen.queryByText('Kate Bishop')).not.toBeInTheDocument();
	});

	it('filters users by role', async () => {
		render(<UserManagement />);

		// Initially shows all users
		expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		expect(screen.getByText('Bob Smith')).toBeInTheDocument();

		// Filter by admin role
		const roleFilter = screen.getByDisplayValue('All');
		fireEvent.change(roleFilter, { target: { value: 'admin' } });

		// Should only show admin users
		await waitFor(() => {
			expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
			expect(screen.getByText('Grace Lee')).toBeInTheDocument();
			expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
		});
	});

	it('searches users by name', async () => {
		render(<UserManagement />);

		const searchBar = screen.getByTestId('search-bar');
		fireEvent.change(searchBar, { target: { value: 'Alice' } });

		await waitFor(() => {
			expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
			expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
		});
	});

	it('searches users by email', async () => {
		render(<UserManagement />);

		const searchBar = screen.getByTestId('search-bar');
		fireEvent.change(searchBar, { target: { value: 'bob@example' } });

		await waitFor(() => {
			expect(screen.getByText('Bob Smith')).toBeInTheDocument();
			expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
		});
	});

	it('sorts users by name or email', async () => {
		render(<UserManagement />);

		// Default sort is by name
		const rows = screen.getAllByRole('row').slice(1); // Skip header row
		expect(rows[0].textContent).toContain('Alice');

		// Change sort to email
		const sortSelect = screen.getByDisplayValue('Name');
		fireEvent.change(sortSelect, { target: { value: 'email' } });

		await waitFor(() => {
			const rowsAfterSort = screen.getAllByRole('row').slice(1);
			// First user should be Bob as his email starts with 'ab'
			expect(rowsAfterSort[0].textContent).toContain('Bob');
		});
	});

	it('paginates through users', async () => {
		render(<UserManagement />);

		// First page should contain first 10 users
		expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		expect(screen.queryByText('Kate Bishop')).not.toBeInTheDocument();

		// Click on next page
		fireEvent.click(screen.getByText('Next'));

		await waitFor(() => {
			// Second page should contain the 11th user
			expect(screen.getByText('Kate Bishop')).toBeInTheDocument();
			expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
		});

		// Go back to previous page
		fireEvent.click(screen.getByText('Previous'));

		await waitFor(() => {
			expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
			expect(screen.queryByText('Kate Bishop')).not.toBeInTheDocument();
		});
	});

	it('opens edit user modal when edit button is clicked', async () => {
		render(<UserManagement />);

		// Find and click the Edit button for Alice
		const editButtons = screen.getAllByText('Edit');
		fireEvent.click(editButtons[0]);

		await waitFor(() => {
			expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
			expect(
				screen.getByText('Editing user: Alice Johnson')
			).toBeInTheDocument();
		});

		// Close the modal
		fireEvent.click(screen.getByTestId('close-modal'));

		await waitFor(() => {
			expect(
				screen.queryByTestId('edit-user-modal')
			).not.toBeInTheDocument();
		});
	});

	it('shows default avatar when user has no avatar', () => {
		render(<UserManagement />);

		const avatarImgs = screen.getAllByRole('img');

		// Alice has no avatar, should use default
		const aliceAvatar = avatarImgs[0];
		expect(aliceAvatar.src).toContain('encrypted-tbn0.gstatic.com');

		// Bob has an avatar, should use his avatar
		const bobAvatar = avatarImgs[1];
		expect(bobAvatar.src).toContain('avatar-url');
	});

	it('disables pagination buttons appropriately', () => {
		render(<UserManagement />);

		// On first page, Previous should be disabled
		const prevButton = screen.getByText('Previous').closest('button');
		expect(prevButton).toHaveAttribute('disabled');

		// Next should be enabled (we have 11 users, so 2 pages)
		const nextButton = screen.getByText('Next').closest('button');
		expect(nextButton).not.toHaveAttribute('disabled');

		// Go to second page
		fireEvent.click(nextButton);

		// On second page, Next should be disabled
		setTimeout(() => {
			expect(nextButton).toHaveAttribute('disabled');
			expect(prevButton).not.toHaveAttribute('disabled');
		}, 0);
	});
});
