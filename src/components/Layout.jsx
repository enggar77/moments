import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
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
