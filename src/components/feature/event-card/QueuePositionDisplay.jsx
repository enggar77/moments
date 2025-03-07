import { Ticket, CircleArrowRight, LoaderCircle } from 'lucide-react';

export default function QueuePositionDisplay({ queuePosition, availability }) {
	if (!queuePosition || queuePosition.status !== 'waiting') return null;

	if (availability.purchasedCount >= availability.totalTickets) {
		return (
			<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
				<div className="flex items-center">
					<Ticket className="w-5 h-5 text-gray-400 mr-2" />
					<span className="text-gray-600">Event is sold out</span>
				</div>
			</div>
		);
	}

	if (queuePosition.position === 2) {
		return (
			<div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
				<div className="flex items-center">
					<CircleArrowRight className="w-5 h-5 text-amber-500 mr-2" />
					<span className="text-amber-700 font-medium">
						You&apos;re next in line! (Queue position:{' '}
						{queuePosition.position})
					</span>
				</div>
				<div className="flex items-center">
					<LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
					<span className="text-amber-600 text-sm">Waiting for ticket</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
			<div className="flex items-center">
				<LoaderCircle className="w-4 h-4 mr-2 animate-spin text-blue-500" />
				<span className="text-blue-700">Queue position</span>
			</div>
			<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
				#{queuePosition.position}
			</span>
		</div>
	);
}