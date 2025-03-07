import { Calendar, MapPin } from 'lucide-react';
import Button from './Button';

export default function Hero() {
	return (
		<div
			className="hero h-[70vh] w-screen absolute left-0"
			style={{
				backgroundImage:
					'url(https://glossmagazine.net/wp-content/uploads/2023/08/taylor1-scaled.jpeg)',
				backgroundPosition: 'top',
				backgroundSize: 'cover',
			}}
		>
			<div className="hero-overlay"></div>
			<div className="hero-content text-neutral-content flex w-full justify-start">
				<div className="w-full">
					<h1 className="mb-5 text-5xl font-medium">
						Taylor Swift: The Eras Tour
					</h1>
					<p className="mb-5">
						Experience the concert of the decade - Live at Gelora
						Bung Karno
					</p>
					<div className="flex gap-5">
						<div className="flex gap-1">
							<Calendar />
							<p>March 15, 2025</p>
						</div>
						<div className="flex gap-1">
							<MapPin />
							<p>Jakarta, Indonesia</p>
						</div>
					</div>
					<Button className="mt-5 bg-accent btn-xl text-[#000272] border-2 border-[#FF6F3C] px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:bg-[#FF6F3C] hover:text-white hover:border-[#FFB433] hover:shadow-lg">
						Get Tickets
					</Button>
				</div>
			</div>
		</div>
	);
}
