import { Calendar, MapPin } from 'lucide-react';
import Button from './Button';

export default function Hero() {
	return (
		<div
			className="hero h-[70vh] w-screen absolute left-0"
			style={{
				backgroundImage:
					'url(https://www.moshville.co.uk/wordpress/wp-content/uploads/2024/02/Taylor-Swift-header.jpg)',
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
					<Button className="bg-white text-black !text-xl p-6 border border-gray-300 hover:bg-gray-200 my-6">
						Get Tickets
					</Button>
				</div>
			</div>
		</div>
	);
}
