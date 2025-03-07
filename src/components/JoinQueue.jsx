import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { WAITING_LIST_STATUS } from '../../convex/constants';
import Loading from './Loading';
import { Clock, OctagonXIcon } from 'lucide-react';
import { useToast } from '../libs/useToast';
import { ConvexError } from 'convex/values';
import Button from './Button';
import { useUser } from '@clerk/clerk-react';

export default function JoinQueue({ eventId, userId }) {
	const { addToast, ToastContainer } = useToast();
	const joinWaitingList = useMutation(api.events.joinWaitingList);
	const queuePosition = useQuery(api.waitingList.getQueuePosition, {
		eventId,
		userId,
	});
	const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
		eventId,
		userId,
	});
	const availability = useQuery(api.events.getEventAvailability, { eventId });
	const event = useQuery(api.events.getById, { eventId });
	const { user } = useUser();
	const userRole = useQuery(api.users.getUser, { userId: user.id });

	const handleJoinQueue = async () => {
		try {
			const result = await joinWaitingList({ eventId, userId });
			if (result.success) {
				addToast('Successfully joined the waiting list', 'success');
			}
		} catch (error) {
			if (
				error instanceof ConvexError &&
				error.message.includes('joined the waiting list too many times')
			) {
				addToast(error.data, 'error');
			} else {
				console.error('Error joining waiting list:', error);
				addToast('Error joining waiting list', 'error');
			}
		}
	};

	if (queuePosition === undefined || availability === undefined || !event) {
		return <Loading />;
	}

	if (userTicket) {
		return null;
	}

	const isPastEvent = event.eventDate < Date.now();

	return (
		<div>
			<ToastContainer />
			{(!queuePosition ||
				queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
				(queuePosition.status === WAITING_LIST_STATUS.OFFERED &&
					queuePosition.offerExpiresAt &&
					queuePosition.offerExpiresAt <= Date.now())) && (
				<>
					{userRole.role !== 'user' ? (
						<div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg">
							<OctagonXIcon className="w-5 h-5" />
							<span>{userRole.role} cannot buy a ticket</span>
						</div>
					) : isPastEvent ? (
						<div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
							<Clock className="w-5 h-5" />
							<span>Event has ended</span>
						</div>
					) : availability.purchasedCount >=
					  availability?.totalTickets ? (
						<div className="text-center p-4">
							<p className="text-lg font-semibold text-error">
								Sorry, this event is sold out
							</p>
						</div>
					) : (
						<Button
							onClick={handleJoinQueue}
							disabled={isPastEvent || userRole.role !== 'user'}
							className="w-full btn-lg btn-warning"
						>
							Buy Ticket
						</Button>
					)}
				</>
			)}
		</div>
	);
}
