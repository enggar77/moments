import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import {
	CalendarDays,
	Edit,
	Ticket,
	Ban,
	Banknote,
	InfoIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { useStorageUrl } from '../../libs/utils';
import CancelEventButton from './CancelEventButton';
import Button from '../../components/Button';

export default function SellerEventsList() {
	const { user } = useUser();
	const events = useQuery(api.events.getSellerEvents, {
		userId: user?.id,
	});

	if (!events) return null;

	const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
	const pastEvents = events.filter((e) => e.eventDate <= Date.now());

	return (
		<div className="mx-auto space-y-8">
			{/* Upcoming Events */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Upcoming Events
				</h2>
				<div className="grid grid-cols-1 gap-6">
					{upcomingEvents.map((event) => (
						<SellerEventCard key={event._id} event={event} />
					))}
					{upcomingEvents.length === 0 && (
						<p className="text-gray-500">No upcoming events</p>
					)}
				</div>
			</div>

			{/* Past Events */}
			{pastEvents.length > 0 && (
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Past Events
					</h2>
					<div className="grid grid-cols-1 gap-6">
						{pastEvents.map((event) => (
							<SellerEventCard key={event._id} event={event} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function SellerEventCard({ event }) {
	const imageUrl = useStorageUrl(event.imageStorageId);
	const isPastEvent = event.eventDate < Date.now();

	return (
		<div
			className={`bg-white rounded-lg shadow-sm border ${event.is_cancelled ? 'border-red-200' : 'border-gray-200'} overflow-hidden`}
		>
			<div className="p-6">
				<div className="flex items-start gap-6">
					{/* Event Image */}
					{imageUrl && (
						<div className="relative w-80 h-50 rounded-lg overflow-hidden shrink-0">
							<img
								src={imageUrl}
								alt={event.name}
								className="object-cover w-full h-full"
							/>
						</div>
					)}

					{/* Event Details */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-4 flex-wrap">
							<div className="flex-1 min-w-[200px]">
								<h3 className="text-xl font-semibold text-gray-900">
									{event.name}
								</h3>
								<p className="mt-1 text-gray-500">
									{event.description}
								</p>
								{event.is_cancelled && (
									<div className="mt-2 flex items-center gap-2 text-red-600">
										<Ban className="w-4 h-4" />
										<span className="text-sm font-medium">
											Event Cancelled & Refunded
										</span>
									</div>
								)}
							</div>
							{!isPastEvent && !event.is_cancelled && (
								<div className="flex items-center gap-2 shrink-0">
									<Link
										to={`/seller/events/${event._id}/edit`}
									>
										<Button
											className={'btn-sm btn-soft'}
											icon={<Edit className="w-4 h-4" />}
										>
											Edit
										</Button>
									</Link>
									<CancelEventButton eventId={event._id} />
								</div>
							)}
						</div>

						<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-gray-50 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-600 mb-1">
									<Ticket className="w-4 h-4" />
									<span className="text-sm font-medium">
										{event.is_cancelled
											? 'Tickets Refunded'
											: 'Tickets Sold'}
									</span>
								</div>
								<p className="text-2xl font-semibold text-gray-900">
									{event.is_cancelled ? (
										<>
											{event.metrics.refundedTickets}
											<span className="text-sm text-gray-500 font-normal">
												{' '}
												refunded
											</span>
										</>
									) : (
										<>
											{event.metrics.soldTickets}
											<span className="text-sm text-gray-500 font-normal">
												/{event.totalTickets}
											</span>
										</>
									)}
								</p>
							</div>

							<div className="bg-gray-50 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-600 mb-1">
									<Banknote className="w-4 h-4" />
									<span className="text-sm font-medium">
										{event.is_cancelled
											? 'Amount Refunded'
											: 'Revenue'}
									</span>
								</div>
								<p className="text-2xl font-semibold text-gray-900">
									£
									{event.is_cancelled
										? event.metrics.refundedTickets *
											event.price
										: event.metrics.revenue}
								</p>
							</div>

							<div className="bg-gray-50 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-600 mb-1">
									<CalendarDays className="w-4 h-4" />
									<span className="text-sm font-medium">
										Date
									</span>
								</div>
								<p className="text-sm font-medium text-gray-900">
									{new Date(
										event.eventDate
									).toLocaleDateString()}
								</p>
							</div>

							<div className="bg-gray-50 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-600 mb-1">
									<InfoIcon className="w-4 h-4" />
									<span className="text-sm font-medium">
										Status
									</span>
								</div>
								<p className="text-sm font-medium text-gray-900">
									{event.is_cancelled
										? 'Cancelled'
										: isPastEvent
											? 'Ended'
											: 'Active'}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
