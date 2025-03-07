import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
	return (
		<div className="bg-neutral text-base-content relative">
			<Navbar />
			<div className="min-h-screen flex flex-col max-w-7xl mx-auto">
				<main className="grow  pb-[85vh] sm:pb-96">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
}
