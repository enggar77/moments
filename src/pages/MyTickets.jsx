import TicketCard from '../components/TicketCard';

export default function MyTickets() {
	const tickets = [
		{
			name: 'Taylor Swift: The Eras Tour',
			type: 'VIP Package',
			date: '3 Oktober 2025',
			time: '8:00 PM',
			location: 'Gelora Bung Karno',
			seat: 'Section A, Row 1, Seat 15',
		},
		{
			name: 'Aurora: World Tour',
			type: 'Green',
			date: '3 Oktober 2025',
			time: '8:00 PM',
			location: 'Gelora Bung Karno',
			seat: 'Section A, Row 1, Seat 15',
		},
		{
			name: 'Twenty One Pilots: Clancy Tour',
			type: 'Festival',
			date: '3 Oktober 2025',
			time: '8:00 PM',
			location: 'Gelora Bung Karno',
			seat: 'Section A, Row 1, Seat 15',
		},
	];
	return (
		<div>
			<h1 className="text-3xl mt-12 font-bold">My Tickets</h1>
			<p className="mt-2">Manage your upcoming events</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
				{tickets.map((ticket) => {
					return <TicketCard id={ticket.id} data={ticket} />;
				})}
			</div>
		</div>
	);
}
