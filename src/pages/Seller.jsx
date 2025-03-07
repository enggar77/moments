import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router';

export default function Seller() {
	const { user } = useUser();
	const navigate = useNavigate();

	const userRole = useQuery(api.users.getUser, { userId: user.id });
	if (!user || userRole.role !== 'organizer') navigate('/');

	return <div>{/* <SellerDashboard /> */}Hello</div>;
}
