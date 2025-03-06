import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate, Outlet } from 'react-router';
// import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import Overview from './Overview';

export default function Dashboard() {
	const navigate = useNavigate();
	const { user, isLoaded } = useUser();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Only run the query if user exists and is loaded
	// const userRole = useQuery(
	// 	api.users.getUser,
	// 	isLoaded && user?.id ? { userId: user.id } : 'skip'
	// );

	// if (userRole.role !== 'admin') navigate('/');

	return (
		<div className="flex-1/2">
			{/* <Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/> */}
			<Overview />
			<div>
				<Outlet />
			</div>
		</div>
	);
}
