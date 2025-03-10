import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useMutation } from 'convex/react';
import ReleaseTicket from '../../components/ReleaseTicket';

// Mock the Convex hooks
vi.mock('convex/react', () => ({
  useMutation: vi.fn()
}));

// Mock the confirm function
globalThis.confirm = vi.fn();

describe('ReleaseTicket Component', () => {
  const mockReleaseTicket = vi.fn();
  const eventId = 'event123';
  const waitingListId = 'waitlist456';

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the useMutation mock to return our mock function
    useMutation.mockReturnValue(mockReleaseTicket);
    // Default confirm to return true
    globalThis.confirm.mockReturnValue(true);
  });

  it('renders correctly', () => {
    render(<ReleaseTicket eventId={eventId} waitingListId={waitingListId} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Release Ticket Offer');
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when releasing ticket', async () => {
    // Make the mutation function return a promise that we control
    const releasePromise = new Promise(resolve => setTimeout(resolve, 100));
    mockReleaseTicket.mockReturnValue(releasePromise);

    render(<ReleaseTicket eventId={eventId} waitingListId={waitingListId} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check if button text changes to loading state
    expect(screen.getByText('Releasing...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    // Wait for the promise to resolve
    await waitFor(() => expect(mockReleaseTicket).toHaveBeenCalled());
  });

  it('calls releaseTicket mutation with correct params when confirmed', async () => {
    render(<ReleaseTicket eventId={eventId} waitingListId={waitingListId} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check if confirm was called
    expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure you want to release your ticket offer?');
    
    // Check if the mutation was called with the right parameters
    expect(mockReleaseTicket).toHaveBeenCalledWith({
      eventId,
      waitingListId
    });
  });

  it('does not call releaseTicket mutation when user cancels the confirmation', () => {
    // Make confirm return false to simulate user canceling
    globalThis.confirm.mockReturnValue(false);
    
    render(<ReleaseTicket eventId={eventId} waitingListId={waitingListId} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Confirm was called
    expect(globalThis.confirm).toHaveBeenCalled();
    
    // But the mutation was not called
    expect(mockReleaseTicket).not.toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    // Mock console.error
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation();
    
    // Make the mutation throw an error
    const error = new Error('Test error');
    mockReleaseTicket.mockRejectedValue(error);
    
    render(<ReleaseTicket eventId={eventId} waitingListId={waitingListId} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Error releasing ticket:', error);
    });
    
    // Button should return to normal state after error
    expect(button).not.toBeDisabled();
    expect(screen.getByText('Release Ticket Offer')).toBeInTheDocument();
    
    // Clean up the console mock
    consoleErrorMock.mockRestore();
  });
});