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
import SearchBar from './SearchBar';

export default function Navbar() {
	const { user, isLoaded } = useUser();
	const { openSignIn } = useClerk();
	const { pathname } = useLocation();

	// Only run the query if user exists and is loaded
	const userRole = useQuery(
		api.users.getUser,
		isLoaded && user?.id ? { userId: user.id } : 'skip'
	);

	const navbarLayout = (children) => (
		<div className="border-b border-base-content/10 sticky inset-0 bg-base-200 z-10">
			<div className="flex flex-col px-5 py-3 gap-4 md:px-10 max-w-7xl mx-auto">
				<div className="flex justify-between items-center">
					<Link to="/">
						<h1 className="font-semibold text-xl">MOMENTS</h1>
					</Link>

					<div className="flex items-center gap-10">
						{(pathname === '/' || pathname === '/search') && (
							<div className="hidden lg:block">
								<SearchBar />
							</div>
						)}
						{children}
					</div>
				</div>

				{(pathname === '/' || pathname === '/search') && (
					<div className="lg:hidden">
						<SearchBar />
					</div>
				)}
			</div>
		</div>
	);

	// When Clerk is still loading
	if (!isLoaded) return <div />;

	// When user is not signed in
	if (!user) {
		return navbarLayout(
			<SignedOut>
				<Button
					className={'btn-sm btn-primary'}
					onClick={() => openSignIn()}
				>
					Sign In
				</Button>
			</SignedOut>
		);
	}

	// When user is signed in but role data is still loading
	if (userRole === undefined) {
		return navbarLayout(<div />);
	}

	// When user role is loaded but is null (user might not exist in database yet)
	if (userRole === null) {
		return navbarLayout(
			<SignedIn>
				<UserButton />
			</SignedIn>
		);
	}

	// User is fully loaded with role
	return navbarLayout(
		<div className="flex items-center gap-5">
			<div className="text-sm font-medium">
				{/* Event Organizer */}
				{userRole.role === 'organizer' && (
					<Link to="/seller">
						<Button className={'btn-sm btn-primary'}>
							Sell Tickets
						</Button>
					</Link>
				)}
				{/* Regular User */}
				{userRole.role === 'user' && (
					<Link to={`tickets/${user.id}`}>
						<Button className={'btn-sm btn-primary'}>
							My Tickets
						</Button>
					</Link>
				)}
			</div>

			<div className="w-[2px] bg-base-content/30 h-5" />

			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
}
