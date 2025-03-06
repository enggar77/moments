import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Loading from './Loading';
import { CalendarDays, Ticket } from 'lucide-react';
import EventCard from './EventCard';

export default function EventList() {
	const events = useQuery(api.events.get);

	if (!events) {
		return <Loading />;
	}

	const upcomingEvents = events
		.filter((event) => event.eventDate > Date.now())
		.sort((a, b) => a.eventDate - b.eventDate);

	const pastEvents = events
		.filter((event) => event.eventDate <= Date.now())
		.sort((a, b) => b.eventDate - a.eventDate);

	return (
		<div className="px-4 md:px-10">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">Upcoming Events</h1>
					<p className="mt-2">
						Discover & book tickets for amazing events
					</p>
				</div>
				<div className=" px-4 py-2 rounded-lg shadow-sm border ">
					<div className="flex items-center gap-2 ">
						<CalendarDays className="w-5 h-5" />
						<span className="font-medium">
							{upcomingEvents.length} Upcoming Events
						</span>
					</div>
				</div>
			</div>

			{/* Upcoming Events Grid */}
			{upcomingEvents.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{upcomingEvents.map((event) => (
						<EventCard key={event._id} eventId={event._id} />
					))}
				</div>
			) : (
				<div className="rounded-lg p-12 text-center mb-12 bg-base-300">
					<Ticket className="w-12 h-12 mx-auto mb-4" />
					<h3 className="text-lg font-medium">No upcoming events</h3>
					<p className=" mt-1">Check back later for new events</p>
				</div>
			)}

			{/* Past Events Section */}
			{pastEvents.length > 0 && (
				<>
					<h2 className="text-2xl font-bold mb-6">Past Events</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{pastEvents.map((event) => (
							<EventCard key={event._id} eventId={event._id} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
