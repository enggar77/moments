import { useState } from 'react';
import { Ban } from 'lucide-react';
import { refundEventTickets } from '../../libs/refundEventTickets';
import { useToast } from '../../libs/useToast';
import { useNavigate } from 'react-router';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import Button from '../../components/Button';

export default function CancelEventButton({ eventId }) {
	const [isCancelling, setIsCancelling] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const { addToast, ToastContainer } = useToast();
	const navigate = useNavigate();
	const cancelEvent = useMutation(api.events.cancelEvent);

	const handleCancel = async () => {
		setIsCancelling(true);
		try {
			await refundEventTickets(eventId);
			await cancelEvent({ eventId });
			addToast('All tickets have been refunded successfully.', 'success');
			navigate('/seller/my-events');
		} catch (error) {
			console.error('Failed to cancel event:', error);
			addToast('Failed to cancel event. Please try again.', 'error');
		} finally {
			setIsCancelling(false);
			setShowConfirm(false);
		}
	};

	return (
		<>
			<Button
				onClick={() => setShowConfirm(true)}
				disabled={isCancelling}
				className={'btn-error btn-sm whitespace-nowrap'}
			>
				<Ban className="w-4 h-4" />
				<span>{isCancelling ? 'Processing...' : 'Cancel Event'}</span>
			</Button>
			<ConfirmDialog
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={handleCancel}
				title="Confirm Cancel Event"
				message="Are you sure you want to cancel this event? All tickets will be refunded."
			/>
			<ToastContainer />
		</>
	);
}
