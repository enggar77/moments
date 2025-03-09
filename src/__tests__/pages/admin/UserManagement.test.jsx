import { mockApi } from '../../../mocks/mockApi';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockUsers } from '../../../mocks/mockData';
import UserManagement from '../../../pages/admin/UserManagement';

// Mock api call
vi.mock('../../../../convex/_generated/api', () => mockApi);

vi.mock('convex/react', async () => {
	const actual = await vi.importActual('convex/react');
	return {
		...actual,
		useQuery: (queryKey) => {
			console.log('Received queryKey:', queryKey);
			if (queryKey === 'mocked_users_getAllUsers') return mockUsers;
			return [];
		},
		useMutation: () => ({}),
	};
});

describe('UserManagement', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders the table with user data', () => {
		// Mock useQuery to return user data after the loading state
		render(<UserManagement />);

		expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		expect(screen.getByText('Jack Ryan')).toBeInTheDocument();
		expect(screen.queryByText('Kate Bishop')).not.toBeInTheDocument();
	});
});
