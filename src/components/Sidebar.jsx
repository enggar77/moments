import { Link, useLocation } from 'react-router';
import { LineChart, Music, Ticket, Users, X, Menu } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
	const { pathname } = useLocation();

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 bg-opacity-50 md:hidden"
					onClick={onClose}
				></div>
			)}

			<div
				className={`fixed md:top-auto md:relative left-0 w-64 min-h-screen bg-[#222222] shadow-lg p-4 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out z-3 text-white ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
			>
				<div className="flex justify-around items-center">
					<h2 className="text-lg font-semibold text-white">
						Admin Dashboard
					</h2>
					<button
						className="md:hidden self-end p-2 rounded"
						onClick={onClose}
					>
						<X className="w-6 h-6" />
					</button>
				</div>
				<nav className="flex flex-col gap-2">
					<Link
						to="/dashboard"
						className={`p-3 rounded-lg hover:border-b-2 hover:border-[#FAB700] hover:text-[#FAB700] ${pathname === '/dashboard' ? 'border-b-2 border-[#FAB700] text-[#FAB700]' : ''}`}
					>
						<LineChart className="w-5 h-5 inline" /> Overview
					</Link>
					<Link
						to="/dashboard/events"
						className={`p-3 rounded-lg hover:border-b-2 hover:border-[#FAB700] hover:text-[#FAB700] ${pathname === '/dashboard/events' ? 'border-b-2 border-[#FAB700] text-[#FAB700]' : ''}`}
					>
						<Music className="w-5 h-5 inline" /> Concerts Management
					</Link>
					<Link
						to="/dashboard/transactions"
						className={`p-3 rounded-lg hover:border-b-2 hover:border-[#FAB700] hover:text-[#FAB700] ${pathname === '/dashboard/transactions' ? 'border-b-2 border-[#FAB700] text-[#FAB700]' : ''}`}
					>
						<Ticket className="w-5 h-5 inline" /> Transactions
					</Link>
					<Link
						to="/dashboard/users"
						className={`p-3 rounded-lg hover:border-b-2 hover:border-[#FAB700] hover:text-[#FAB700] ${pathname === '/dashboard/users' ? 'border-b-2 border-[#FAB700] text-[#FAB700]' : ''}`}
					>
						<Users className="w-5 h-5 inline" /> Users
					</Link>
				</nav>
			</div>
		</>
	);
}
