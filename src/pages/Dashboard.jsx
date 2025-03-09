import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate, Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';

export default function Dashboard() {
	const navigate = useNavigate();
	const { user, isLoaded } = useUser();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Only run the query if user exists and is loaded
	// const userRole = useQuery(
	// 	api.users.getUser,
	// 	isLoaded && user?.id ? { userId: user.id } : 'skip'
	// );

	// if (userRole?.role !== 'admin') navigate('/');

	useEffect(() => {
		document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
	}, [isSidebarOpen]);

	return (
		<div className="flex flex-col md:flex-row">
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>
			<div className="flex-1 p-4 overflow-auto">
				<button
					className="md:hidden p-2 bg-gray-200 rounded shadow-lg"
					onClick={() => setIsSidebarOpen(true)}
				>
					☰ Open Menu
				</button>
				<div className='flex justify-center w-full'>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
