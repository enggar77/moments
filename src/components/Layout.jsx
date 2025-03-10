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
		<div className="bg-base-200 text-base-content relative text-sm">
			<Navbar />

			<div className="min-h-screen flex flex-col max-w-7xl mx-auto">
				<main className="grow">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
}
