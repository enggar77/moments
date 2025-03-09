import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Button from '../Button';
import ConfirmDialog from '../ConfirmDialog';

export default function ReleaseTicket({ eventId, waitingListId }) {
	const [isReleasing, setIsReleasing] = useState(false);
	const releaseTicket = useMutation(api.waitingList.releaseTicket);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleRelease = async () => {
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
		<>
			<Button
				onClick={() => setShowConfirm(true)}
				disabled={isReleasing}
				className={'w-full btn-error btn-link'}
			>
				<XCircle className="w-4 h-4" />
				{isReleasing ? 'Releasing...' : 'Release Ticket Offer'}
			</Button>

			<ConfirmDialog
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={handleRelease}
				title="Release Ticket"
				message="Are you sure you want to release your ticket offer?"
				confirmText="Release"
				cancelText="Cancel"
				confirmButtonClass="btn-error"
			/>
		</>
	);
}
