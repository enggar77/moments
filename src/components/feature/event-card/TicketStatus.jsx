import { Check, PencilIcon, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import PurchaseTicket from '../PurchaseTicket';
import QueuePositionDisplay from './QueuePositionDisplay';

export default function TicketStatus({
	user,
	eventId,
	isEventOwner,
	userTicket,
	queuePosition,
	availability,
	// isPastEvent,
}) {
	const navigate = useNavigate();

	if (!user) return null;

	if (isEventOwner) {
		return (
			<div className="mt-4">
				<button
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/seller/events/${eventId}/edit`);
					}}
					className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
				>
					<PencilIcon className="w-5 h-5" />
					Edit Event
				</button>
			</div>
		);
	}

	if (userTicket) {
		return (
			<div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
				<div className="flex items-center">
					<Check className="w-5 h-5 text-green-600 mr-2" />
					<span className="text-green-700 font-medium">
						You have a ticket!
					</span>
				</div>
				<button
					onClick={() => navigate(`/tickets/${userTicket._id}`)}
					className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
				>
					View your ticket
				</button>
			</div>
		);
	}

	if (queuePosition) {
		return (
			<div className="mt-4">
				{queuePosition.status === 'offered' && (
					<PurchaseTicket eventId={eventId} />
				)}
				<QueuePositionDisplay
					queuePosition={queuePosition}
					availability={availability}
				/>
				{queuePosition.status === 'expired' && (
					<div className="p-3 bg-red-50 rounded-lg border border-red-100">
						<span className="text-red-700 font-medium flex items-center">
							<XCircle className="w-5 h-5 mr-2" />
							Offer expired
						</span>
					</div>
				)}
			</div>
		);
	}

	return null;
}
