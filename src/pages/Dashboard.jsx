import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router';

export default function Dashboard() {
	const navigate = useNavigate();
	const { user, isLoaded } = useUser();

	// Only run the query if user exists and is loaded
	const userRole = useQuery(
		api.users.getUser,
		isLoaded && user?.id ? { userId: user.id } : 'skip'
	);

	if (userRole.role !== 'admin') navigate('/');

	return (
		<div>
			<h1>Dashboard Admin</h1>
			<ul>
				<li>
					<Link to="/dashboard/events">All Events</Link>
				</li>
				<li>
					<Link to="/dashboard/users">All Users</Link>
				</li>
			</ul>
		</div>
	);
}
