import { StarIcon } from 'lucide-react';

export default function EventHeader({
	event,
	isEventOwner,
	isPastEvent,
	availability,
}) {
	return (
		<div className="flex justify-between items-start">
			<div>
				<div className="flex flex-col items-start gap-2">
					{isEventOwner && (
						<span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
							<StarIcon className="w-3 h-3" />
							Your Event
						</span>
					)}
					<h2 className="text-xl font-bold text-gray-900">
						{event.name}
					</h2>
				</div>
				{isPastEvent && (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
						Past Event
					</span>
				)}
			</div>

			{/* Price Tag */}
			<div className="flex flex-col items-end gap-2 ml-4 text-sm">
				<span
					className={`px-3 py-1 font-semibold rounded-full whitespace-nowrap ${
						isPastEvent
							? 'bg-gray-50 text-gray-500'
							: 'bg-emerald-50 text-emerald-500'
					}`}
				>
					${event.price.toFixed(2)}
				</span>

				{availability.purchasedCount >= availability.totalTickets && (
					<span className=" text-red-700 px-3 py-1 bg-red-50 rounded-full font-semibold text-sm whitespace-nowrap">
						Sold Out
					</span>
				)}
			</div>
		</div>
	);
}
