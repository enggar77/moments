import EventCard from '../components/feature/EventCard';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { CalendarDays, MapPin, Ticket, Users } from 'lucide-react';
import Loading from '../components/Loading';
import JoinQueue from '../components/feature/JoinQueue';
import { SignInButton, useUser } from '@clerk/clerk-react';
import Button from '../components/Button';
import { useParams } from 'react-router';

// InfoCard component for displaying event details with icons
function InfoCard({ icon: Icon, label, value }) {
	return (
		<div className="text-sm p-4 rounded-lg border border-warning/50 bg-warning/10 flex flex-col">
			<div className="flex items-center gap-2 mb-2">
				<Icon className="w-5 h-5" />
				<span className="font-semibold">{label}</span>
			</div>
			<span className="text-gray-600">{value}</span>
		</div>
	);
}

export default function EventPage() {
	const { user } = useUser();
	const params = useParams();
	const event = useQuery(api.events.getById, {
		eventId: params.id,
	});
	const availability = useQuery(api.events.getEventAvailability, {
		eventId: params.id,
	});

	if (!event || !availability) {
		return <Loading />;
	}

	return (
		<div className=" bg-base-200 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-xl shadow-sm overflow-hidden">
					

					<div className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							{/* Left Column - Event Details */}
							<div className="space-y-8">
								<div>
									<h1 className="text-4xl font-bold mb-4">
										{event.name}
									</h1>
									<p className="text-lg">
										{event.description}
									</p>
								</div>

								<div className="grid grid-cols-2 gap-6">
									<InfoCard
										icon={CalendarDays}
										label="Date"
										value={new Date(
											event.eventDate
										).toLocaleDateString()}
									/>

									<InfoCard
										icon={MapPin}
										label="Location"
										value={event.location}
									/>

									<InfoCard
										icon={Ticket}
										label="Price"
										value={`£${event.price.toFixed(2)}`}
									/>

									<InfoCard
										icon={Users}
										label="Availability"
										value={`${availability.totalTickets - availability.purchasedCount} / ${availability.totalTickets} left`}
									/>
								</div>

								{/* Additional Event Information */}
								<div className="bg-warning/10 border border-warning/50 rounded-lg p-6">
									<h3 className="text-lg font-semibold mb-2">
										Event Information
									</h3>
									<ul className="space-y-2">
										<li>
											• Please arrive 30 minutes before
											the event starts
										</li>
										<li>• Tickets are non-refundable</li>
										<li>• Age restriction: 18+</li>
									</ul>
								</div>
							</div>

							{/* Right Column - Ticket Purchase Card */}
							<div>
								<div className="top-8 space-y-4">
									<EventCard eventId={params.id} />

									{user ? (
										<JoinQueue
											eventId={params.id}
											userId={user.id}
										/>
									) : (
										<SignInButton>
											<Button className="w-full btn-warning btn-lg">
												Sign in to buy tickets
											</Button>
										</SignInButton>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
