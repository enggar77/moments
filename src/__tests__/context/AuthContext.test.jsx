import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../context/AuthContext';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import React from 'react';

// Mock the dependencies
vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(),
}));

vi.mock('convex/react', () => ({
	useMutation: vi.fn(),
}));

vi.mock('../../convex/_generated/api', () => ({
	api: {
		users: {
			createUser: 'users:createUser',
		},
	},
}));

describe('AuthProvider', () => {
	// Set up mocks
	const mockCreateUser = vi.fn();
	const mockUser = {
		id: 'user-123',
		primaryEmailAddress: { emailAddress: 'test@example.com' },
		fullName: 'Test User',
	};

	beforeEach(() => {
		vi.clearAllMocks();
		useUser.mockReturnValue({ user: null });
		useMutation.mockReturnValue(mockCreateUser);
	});

	it('renders children without crashing', () => {
		const { getByText } = render(
			<AuthProvider>
				<div>Test Child</div>
			</AuthProvider>
		);

		expect(getByText('Test Child')).toBeDefined();
	});

	it('does not call createUser when user is null', () => {
		useUser.mockReturnValue({ user: null });

		render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);

		expect(mockCreateUser).not.toHaveBeenCalled();
	});

	it('calls createUser with correct params when user exists', async () => {
		useUser.mockReturnValue({ user: mockUser });

		render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);

		await waitFor(() => {
			expect(mockCreateUser).toHaveBeenCalledWith({
				userId: mockUser.id,
				email: mockUser.primaryEmailAddress.emailAddress,
				name: mockUser.fullName,
			});
		});
	});

	it('handles error when createUser fails', async () => {
		useUser.mockReturnValue({ user: mockUser });
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});
		const error = new Error('Failed to create user');
		mockCreateUser.mockRejectedValueOnce(error);

		render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);

		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error creating user:',
				error
			);
		});

		consoleErrorSpy.mockRestore();
	});

	it('provides context value to children', () => {
		// Create a test component that consumes the context
		const TestConsumer = () => {
			const contextValue = React.useContext(AuthContext);
			return (
				<div data-testid="context-value">{String(contextValue)}</div>
			);
		};

		const { getByTestId } = render(
			<AuthProvider>
				<TestConsumer />
			</AuthProvider>
		);

		expect(getByTestId('context-value').textContent).toBe('');
	});

	it('does not trigger user sync when user id is missing', () => {
		useUser.mockReturnValue({
			user: {
				// Missing id
				primaryEmailAddress: { emailAddress: 'test@example.com' },
				fullName: 'Test User',
			},
		});

		render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);

		expect(mockCreateUser).not.toHaveBeenCalled();
	});

	it('only syncs user once on initial render', async () => {
		useUser.mockReturnValue({ user: mockUser });

		const { rerender } = render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);

		await waitFor(() => {
			expect(mockCreateUser).toHaveBeenCalledTimes(1);
		});

		// Re-render without changing user
		rerender(
			<AuthProvider>
				<div>Updated Test</div>
			</AuthProvider>
		);

		// Should still only be called once
		expect(mockCreateUser).toHaveBeenCalledTimes(1);
	});
});
