import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useNavigate } from 'react-router';
import SellerDashboard from '../../components/feature/SellerDashboard';
import Loading from '../../components/Loading';

export default function Seller() {
	const { user } = useUser();
	const navigate = useNavigate();

	const userRole = useQuery(api.users.getUser, { userId: user?.id });

	if (!user) return <Loading />;
	if (userRole === undefined) return <Loading />;
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
