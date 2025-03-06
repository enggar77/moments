import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { LineChart, Music, Ticket, Users, X, Menu } from 'lucide-react';

export default function Sidebar() {
	const { pathname } = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => setIsOpen(!isOpen);

	return (
		<>
			{/* Hamburger Button */}
			<button
				className="md:hidden fixed top-4 left-4 p-2 bg-gray-200 rounded shadow-lg z-50"
				onClick={toggleSidebar}
			>
				<Menu className="w-6 h-6" />
			</button>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 md:hidden"
					onClick={toggleSidebar}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`fixed md:relative top-0 left-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 z-50`}
			>
				{/* Close Button */}
				<button
					className="md:hidden self-end p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
					onClick={toggleSidebar}
				>
					<X className="w-6 h-6" />
				</button>

				<h2 className="text-lg font-semibold text-gray-700">
					Admin Dashboard
				</h2>
				<nav className="flex flex-col gap-2">
					<Link
						to="/dashboard"
						className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-200 ${pathname === '/dashboard' ? 'bg-gray-200' : ''}`}
					>
						<LineChart className="w-5 h-5" /> Overview
					</Link>
					<Link
						to="/dashboard/events"
						className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-200 ${pathname === '/dashboard/events' ? 'bg-gray-200' : ''}`}
					>
						<Music className="w-5 h-5" /> Concerts Management
					</Link>
					<Link
						to="/dashboard/transactions"
						className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-200 ${pathname === '/dashboard/transactions' ? 'bg-gray-200' : ''}`}
					>
						<Ticket className="w-5 h-5" /> Transactions
					</Link>
					<Link
						to="/dashboard/users"
						className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-200 ${pathname === '/dashboard/users' ? 'bg-gray-200' : ''}`}
					>
						<Users className="w-5 h-5" /> Users
					</Link>
				</nav>
			</div>
		</>
	);
}
