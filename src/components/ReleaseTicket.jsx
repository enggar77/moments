import { api } from '../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Button from './Button';

export default function ReleaseTicket({ eventId, waitingListId }) {
	const [isReleasing, setIsReleasing] = useState(false);
	const releaseTicket = useMutation(api.waitingList.releaseTicket);

	const handleRelease = async () => {
		if (!confirm('Are you sure you want to release your ticket offer?'))
			return;

		try {
			setIsReleasing(true);
			await releaseTicket({
				eventId,
				waitingListId,
			});
		} catch (error) {
			console.error('Error releasing ticket:', error);
		} finally {
			setIsReleasing(false);
		}
	};

	return (
		<Button
			onClick={handleRelease}
			disabled={isReleasing}
			className={'w-full btn-error'}
		>
			<XCircle className="w-4 h-4" />
			{isReleasing ? 'Releasing...' : 'Release Ticket Offer'}
		</Button>
	);
}
