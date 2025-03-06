import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
	return (
		<div className="bg-base-200 text-base-content relative">
			<div className="min-h-screen flex flex-col max-w-7xl mx-auto">
				<Navbar />
				<main className="grow  pb-[85vh] sm:pb-96">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
}
