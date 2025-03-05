import {
	SignedIn,
	SignedOut,
	useClerk,
	UserButton,
	useUser,
} from '@clerk/clerk-react';

import Button from './Button';
import { Link, useLocation } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Navbar() {
	const { pathname } = useLocation();
	const { user } = useUser();
	const { openSignIn } = useClerk();

	const userRole = useQuery(api.users.getUserById, {
		clerkId: user?.id || '',
	}) ?? { role: 'user' };

	if (!user) {
		return (
			<div className="px-10 flex justify-between items-center h-14">
				<Link to="/">
					<h1 className="font-semibold">MOMENTS</h1>
				</Link>
				<SignedOut>
					<Button onClick={() => openSignIn()}>Sign In</Button>
				</SignedOut>
			</div>
		);
	}

	return (
		<div className="px-10 flex justify-between items-center h-14">
			<Link to="/">
				<div className="">
					<h1 className="font-semibold">MOMENTS</h1>
				</div>
			</Link>
			<div className="flex items-center gap-5">
				<div className="text-sm font-medium space-x-4">
					{/* Event Organizer */}
					{userRole.role === 'organizer' && (
						<Link to="/sell">
							<span
								className={
									pathname === '/sell'
										? 'text-base-content/50 underline'
										: ''
								}
							>
								Sell Tickets
							</span>
						</Link>
					)}
					{/* Regular User */}
					{userRole.role === 'user' && (
						<Link to={`ticket/${user.id}`}>
							<span
								className={
									pathname === `/ticket/${user.id}`
										? 'text-base-content/50 underline'
										: ''
								}
							>
								My Tickets
							</span>
						</Link>
					)}

					{/* Admin */}
					{userRole.role === 'admin' && (
						<Link to={`/dashboard`}>
							<span>Dashboard</span>
						</Link>
					)}
				</div>

				<div className="w-[2px] bg-base-content/30 h-5" />

				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</div>
	);
}
