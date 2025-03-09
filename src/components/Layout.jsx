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
		<div className="bg-base-200 text-base-content flex flex-col">
			<Navbar className="z-50"/>
			<main className=" flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
