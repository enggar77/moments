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
import Loading from './Loading';
import SearchBar from './SearchBar';

export default function Navbar() {
	const { user, isLoaded } = useUser();
	const { openSignIn } = useClerk();

	// Only run the query if user exists and is loaded
	const userRole = useQuery(
		api.users.getUser,
		isLoaded && user?.id ? { userId: user.id } : 'skip'
	);

	const navbarLayout = (children) => (
		<div className="flex flex-col p-4 gap-4 md:px-10 border-b border-base-content/10">
			<div className="flex justify-between items-center">
				<Link to="/">
					<h1 className="font-semibold text-xl">MOMENTS</h1>
				</Link>

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
	if (!isLoaded) return <Loading />;

	// When user is not signed in
	if (!user) {
		return navbarLayout(
			<SignedOut>
				<Button onClick={() => openSignIn()}>Sign In</Button>
			</SignedOut>
		);
	}

	// When user is signed in but role data is still loading
	if (userRole === undefined) {
		return navbarLayout(<Loading />);
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
						<Button>Sell Tickets</Button>
					</Link>
				)}
				{/* Regular User */}
				{userRole.role === 'user' && (
					<Link to={`ticket/${user.id}`}>
						<Button>My Tickets</Button>
					</Link>
				)}
				{/* Admin */}
				{userRole.role === 'admin' && (
					<Link to={`/dashboard`}>
						<Button>Dashboard</Button>
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
