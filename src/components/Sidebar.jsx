import { Link, useLocation } from 'react-router';
import { LineChart, Menu, Music, Ticket, Users } from 'lucide-react';

export default function Sidebar() {
	const { pathname } = useLocation();

	return (
		<div className="drawer lg:drawer-open">
			<input
				id="sidebar-toggle"
				type="checkbox"
				className="drawer-toggle"
			/>
			<div className="drawer-content p-4">
				<label
					htmlFor="sidebar-toggle"
					className="btn btn-primary drawer-button lg:hidden"
				>
					<Menu size={24} />
				</label>
			</div>
			<div className="drawer-side">
				<label
					htmlFor="sidebar-toggle"
					className="drawer-overlay"
				></label>
				<aside className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
					<h2 className="text-lg font-semibold mb-4">
						Admin Dashboard
					</h2>
					<ul>
						<SidebarLink
							to="/dashboard"
							pathname={pathname}
							Icon={LineChart}
							text="Overview"
						/>
						<SidebarLink
							to="/dashboard/events"
							pathname={pathname}
							Icon={Music}
							text="Concerts Management"
						/>
						<SidebarLink
							to="/dashboard/transactions"
							pathname={pathname}
							Icon={Ticket}
							text="Transactions"
						/>
						<SidebarLink
							to="/dashboard/users"
							pathname={pathname}
							Icon={Users}
							text="Users"
						/>
					</ul>
				</aside>
			</div>
		</div>
	);
}

function SidebarLink({ to, pathname, Icon, text }) {
	return (
		<li>
			<Link
				to={to}
				className={`${pathname === to ? 'bg-primary text-white' : ''} flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-white`}
			>
				<Icon /> {text}
			</Link>
		</li>
	);
}
