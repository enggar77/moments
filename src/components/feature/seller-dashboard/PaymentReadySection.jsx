import React from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, Plus } from 'lucide-react';
import Button from '../../Button';

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
						<Button
							onClick={() => navigate('/seller/create-event')}
							className={'btn-primary'}
						>
							<Plus className="w-5 h-5" />
							Create Event
						</Button>
						<Button
							onClick={() => navigate('/seller/my-events')}
							className={'btn-soft'}
						>
							<CalendarDays className="w-5 h-5" />
							View My Events
						</Button>
					</div>
				</div>
			</div>
			<hr className="my-8" />
		</>
	);
}
