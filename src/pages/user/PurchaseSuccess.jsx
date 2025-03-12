import { useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import TicketPurchase from './TicketPurchase';
import Loading from '../../components/Loading';
import { api } from '../../../convex/_generated/api';

export default function PurchaseSuccess() {
	const { user, isLoaded } = useUser();
	const navigate = useNavigate();

	const tickets = useQuery(
		api.events.getUserTickets,
		isLoaded && user?.id
			? {
					userId: user.id,
				}
			: 'skip'
	);

	if (!isLoaded) return <Loading />;
	if (!user) navigate('/');
	if (!tickets) return <Loading />;
	const latestTicket =
		tickets.length > 0 ? tickets[tickets.length - 1] : null;
	if (!latestTicket) navigate('/');

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Ticket Purchase Successful!
					</h1>
					<p className="mt-2 text-gray-600">
						Your ticket has been confirmed and is ready to use
					</p>
				</div>

				<TicketPurchase ticketId={latestTicket._id} />
			</div>
		</div>
	);
}
