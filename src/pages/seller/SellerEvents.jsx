import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import SellerEventsList from './SellerEventsList';
import { Link } from 'react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '../../components/Button';

export default function SellerEvents() {
	const { user } = useUser();
	const navigate = useNavigate();
	if (!user) navigate('/');

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Link
								to="/seller"
								className="text-gray-500 hover:text-gray-700 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
							</Link>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									My Events
								</h1>
								<p className="mt-1 text-gray-500">
									Manage your event listings and track sales
								</p>
							</div>
						</div>
						<Link to="/seller/create-event">
							<Button
								className={'btn-primary'}
								icon={<Plus className="w-5 h-5" />}
							>
								Create Event
							</Button>
						</Link>
					</div>
				</div>

				{/* Event List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<SellerEventsList />
				</div>
			</div>
		</div>
	);
}
