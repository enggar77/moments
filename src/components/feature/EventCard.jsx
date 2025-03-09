import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { useNavigate } from 'react-router';
import { api } from '../../../convex/_generated/api';
import { useStorageUrl } from '../../libs/utils';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import EventImage from './event-card/EventImage';
import EventHeader from './event-card/EventHeader';
import TicketStatus from './event-card/TicketStatus';

export default function EventCard({ eventId }) {
	const { user } = useUser();
	const navigate = useNavigate();
	const event = useQuery(api.events.getById, { eventId });
	const availability = useQuery(api.events.getEventAvailability, { eventId });
	const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
		eventId,
		userId: user?.id ?? '',
	});
	const queuePosition = useQuery(api.waitingList.getQueuePosition, {
		eventId,
		userId: user?.id ?? '',
	});
	const imageUrl = useStorageUrl(event?.imageStorageId);

	if (!event || !availability) {
		return null;
	}

	const isPastEvent = event.eventDate < Date.now();
	const isEventOwner = user?.id === event?.userId;

	return (
		<div
			onClick={() => navigate(`/event/${eventId}`)}
			className={`rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-base-200 cursor-pointer overflow-hidden relative ${
				isPastEvent ? 'opacity-75 hover:opacity-100' : ''
			}`}
		>
			{/* <EventImage imageUrl={imageUrl} eventName={event.name} /> */}

			<div className={`p-6 ${imageUrl ? 'relative' : ''}`}>
				<EventHeader
					event={event}
					isEventOwner={isEventOwner}
					isPastEvent={isPastEvent}
					availability={availability}
				/>

				<div className="mt-4 space-y-3">
					<div className="flex items-center text-gray-600">
						<MapPin className="w-4 h-4 mr-2" />
						<span>{event.location}</span>
					</div>

					<div className="flex items-center text-gray-600">
						<CalendarDays className="w-4 h-4 mr-2" />
						<span>
							{new Date(event.eventDate).toLocaleDateString()}{' '}
							{isPastEvent && '(Ended)'}
						</span>
					</div>

					<div className="flex items-center text-gray-600">
						<Ticket className="w-4 h-4 mr-2" />
						<span>
							{availability.totalTickets -
								availability.purchasedCount}{' '}
							/ {availability.totalTickets} available
							{!isPastEvent && availability.activeOffers > 0 && (
								<span className="text-amber-600 text-sm ml-2">
									({availability.activeOffers}{' '}
									{availability.activeOffers === 1
										? 'person'
										: 'people'}{' '}
									trying to buy)
								</span>
							)}
						</span>
					</div>
				</div>

				<p className="mt-4 text-gray-600 text-sm line-clamp-2">
					{event.description}
				</p>

				<div onClick={(e) => e.stopPropagation()}>
					{!isPastEvent && (
						<TicketStatus
							user={user}
							eventId={eventId}
							isEventOwner={isEventOwner}
							userTicket={userTicket}
							queuePosition={queuePosition}
							availability={availability}
							isPastEvent={isPastEvent}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
