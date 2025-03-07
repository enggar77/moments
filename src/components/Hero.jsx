import { Calendar, MapPin } from 'lucide-react';
import Button from './Button';

export default function Hero() {
	return (
		<div
			className="hero h-[70vh] w-screen absolute left-0"
			style={{
				backgroundImage:
					'url(https://i.pinimg.com/1200x/bb/05/2d/bb052d2037e39e3b2c7905e86b8e2466.jpg)',
				backgroundPosition: 'top',
				backgroundSize: 'cover',
			}}
		>
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
					<Button className="mt-5 bg-accent btn-xl text-black border-2 border-black px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:bg-neutral hover:text-white hover:border-white hover:shadow-lg">
						Get Tickets
					</Button>
				</div>
			</div>
		</div>
	);
}
