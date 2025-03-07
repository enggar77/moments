import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

export default function Layout() {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);
	return (
		<div className="bg-base-100 text-base-content relative">
			<div className="min-h-screen flex flex-col max-w-7xl mx-auto">
				<Navbar />
				<main className="grow">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
}
