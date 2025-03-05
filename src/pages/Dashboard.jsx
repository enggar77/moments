import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
	const navigate = useNavigate();
	const user = useUser();
	const userRole = useQuery(api.users.getUserById, {
		clerkId: user?.id || '',
	}) ?? { role: 'user' };

	if (userRole.role !== 'admin') navigate('/');

	return (
		<div>
			<h1>Dashboard Admin</h1>
			<ul>
				<li>
					<a href="/dashboard/events">All Events</a>
				</li>
				<li>
					<a href="/dashboard/users">All Users</a>
				</li>
			</ul>
		</div>
	);
}
