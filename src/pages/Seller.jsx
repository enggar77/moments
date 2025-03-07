import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router';
import SellerDashboard from '../components/SellerDashboard';
import Spinner from '../components/Spinner';

export default function Seller() {
	const { user } = useUser();
	const navigate = useNavigate();

	const userRole = useQuery(api.users.getUser, { userId: user?.id });
	
	if (!user) return <Spinner />;
	if (userRole === undefined) return <Spinner />;
	if (userRole?.role !== 'organizer') {
		navigate('/');
		return null;
	}

	return (
		<div className="container mx-auto py-8">
			<SellerDashboard />
		</div>
	);
}
