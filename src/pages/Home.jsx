import EventList from '../components/feature/EventList';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
	const tickets = useQuery(api.tickets.getAllValidTickets);
	return (
		<div className="py-10">
			<EventList />

			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Valid Tickets</h2>
				{tickets ? (
					<ul className="space-y-4">
						{tickets.map((ticket) => (
							<li
								key={ticket._id}
								className="p-4 bg-white shadow-md rounded-lg"
							>
								<h3 className="font-semibold text-lg">
									{ticket.event.name}
								</h3>
								<p className="text-gray-600">
									Status: {ticket.status}
								</p>
								<p className="text-gray-600">
									Amount: ${ticket.amount / 100}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>Loading tickets...</p>
				)}
			</div>
		</div>
	);
}
