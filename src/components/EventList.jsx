import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Loading from './Loading';
import { CalendarDays, Ticket } from 'lucide-react';
import EventCard from './EventCard';
import Pagination from './Pagination';
import { useState, useCallback } from 'react';

export default function EventList({ searchTerm }) {
	const [activePageUpcoming, setActivePageUpcoming] = useState(1);
	const [activePagePast, setActivePagePast] = useState(1);
	const eventsPerPage = 3;
	
	const handleUpcomingPageChange = useCallback((page) => {
		setActivePageUpcoming(page);
	}, []);
	
	const handlePastPageChange = useCallback((page) => {
		setActivePagePast(page);
	}, []);
	
	const events = useQuery(api.events.get);
	
	if (!events) {
		return <Loading />;
	}
	
	const filteredEvents = events.filter((event) =>
		event.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	
	const upcomingEvents = filteredEvents
		.filter((event) => event.eventDate > Date.now())
		.sort((a, b) => a.eventDate - b.eventDate);
	
	const pastEvents = filteredEvents
		.filter((event) => event.eventDate <= Date.now())
		.sort((a, b) => b.eventDate - a.eventDate);
	
	const totalPagesUpcoming = Math.ceil(upcomingEvents.length / eventsPerPage);
	const startIndexUpcoming = (activePageUpcoming - 1) * eventsPerPage;
	const visibleUpcoming = upcomingEvents.slice(
		startIndexUpcoming,
		startIndexUpcoming + eventsPerPage
	);
	
	const totalPagesPast = Math.ceil(pastEvents.length / eventsPerPage);
	const startIndexPast = (activePagePast - 1) * eventsPerPage;
	const visiblePast = pastEvents.slice(
		startIndexPast,
		startIndexPast + eventsPerPage
	);
	
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
			{visibleUpcoming.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
						{visibleUpcoming.map((event) => (
							<EventCard 
								key={event._id} 
								eventId={event._id} 
							/>
						))}
					</div>
					<div className="flex justify-center mt-8">
						<Pagination
							activePage={activePageUpcoming}
							totalPages={totalPagesUpcoming}
							onPageChange={handleUpcomingPageChange}
						/>
					</div>
				</>
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
						{visiblePast.map((event) => (
							<EventCard
								key={event._id}
								eventId={event._id}
							/>
						))}
					</div>
					<div className="flex justify-center mt-8">
						<Pagination
							activePage={activePagePast}
							totalPages={totalPagesPast}
							onPageChange={handlePastPageChange}
						/>
					</div>
				</>
			)}
		</div>
	);
}
