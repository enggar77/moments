import {
	SignedIn,
	SignedOut,
	useClerk,
	UserButton,
	useUser,
} from '@clerk/clerk-react';

import Button from './Button';
import { Link } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import SearchBar from './SearchBar';
import { Ticket } from 'lucide-react';

export default function Navbar() {
	const { user, isLoaded } = useUser();
	const { openSignIn } = useClerk();

	// Only run the query if user exists and is loaded
	const userRole = useQuery(
		api.users.getUser,
		isLoaded && user?.id ? { userId: user.id } : 'skip'
	);

	const navbarLayout = (children) => (
		<div className="w-screen px-8 md:px-24 flex flex-col p-3 gap-4 border-b border-base-content/10 sticky inset-0 bg-primary z-10">
			<div className="flex justify-between items-center">
				<div className="flex gap-4 items-center">
					<Ticket size={30} />
					<Link to="/">
						<h1 className="font-semibold text-3xl">
							MOMENTS
						</h1>
					</Link>
				</div>

				<div className="flex items-center gap-10">
					{/* <div className="hidden lg:block">
						<SearchBar />
					</div> */}
					{children}
				</div>
			</div>

			{/* <div className="lg:hidden">
				<SearchBar />
			</div> */}
		</div>
	);

	// When Clerk is still loading
	if (!isLoaded) return <div />;

	// When user is not signed in
	if (!user) {
		return navbarLayout(
			<SignedOut>
				<Button className={'btn-sm'} onClick={() => openSignIn()}>
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
					<Link to="/sell">
						<Button className={'btn-sm btn-accent text-black border border-black'}>
							Sell Tickets
						</Button>
					</Link>
				)}
				{/* Regular User */}
				{userRole.role === 'user' && (
					<Link to={`ticket/${user.id}`}>
						<Button className={'btn-sm btn-accent text-black border border-black'}>My Tickets</Button>
					</Link>
				)}
				{/* Admin */}
				{userRole.role === 'admin' && (
					<Link to={`/dashboard`}>
						<Button className={'btn-sm btn-accent text-black border border-black'}>Dashboard</Button>
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
