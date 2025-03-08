import React from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, Plus } from 'lucide-react';

export default function PaymentReadySection() {
	const navigate = useNavigate();

	return (
		<>
			<div className="bg-white p-8 rounded-lg">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">
					Sell tickets for your events
				</h2>
				<p className="text-gray-600 mb-8">
					List your tickets for sale and manage your listings
				</p>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
					<div className="flex justify-center gap-4">
						<button
							onClick={() => navigate('/seller/create-event')}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus className="w-5 h-5" />
							Create Event
						</button>
						<button
							onClick={() => navigate('/seller/my-events')}
							className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
						>
							<CalendarDays className="w-5 h-5" />
							View My Events
						</button>
					</div>
				</div>
			</div>
			<hr className="my-8" />
		</>
	);
}
