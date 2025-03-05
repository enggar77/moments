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

	const userRole = useQuery(
		api.users.getUserById,
		user?.id ? { clerkId: user.id } : undefined
	);

	if (!isLoaded) return <Loading />;
	if (!user) {
		return (
			<div className="flex flex-col p-4  gap-4 md:px-10 border-b border-base-content/10">
				<div className="flex justify-between items-center">
					<Link to="/">
						<h1 className="font-semibold">MOMENTS</h1>
					</Link>

					<div className="flex items-center gap-10">
						<div className="hidden lg:block">
							<SearchBar />
						</div>
						<SignedOut>
							<Button onClick={() => openSignIn()}>
								Sign In
							</Button>
						</SignedOut>
					</div>
				</div>

				<div className="lg:hidden">
					<SearchBar />
				</div>
			</div>
		);
	}
	if (!userRole || !userRole.role) return <Loading />;

	return (
		<div className="flex flex-col p-4 gap-4 md:px-10 border-b border-base-content/10">
			<div className="flex justify-between items-center">
				<Link to="/">
					<h1 className="font-semibold">MOMENTS</h1>
				</Link>

				<div className="flex items-center gap-10">
					<div className="hidden lg:block">
						<SearchBar />
					</div>
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
								<Link to={`ticket/${userRole._id}`}>
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
				</div>
			</div>

			<div className="lg:hidden">
				<SearchBar />
			</div>
		</div>
	);
}
