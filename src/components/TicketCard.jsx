import {
	Calendar,
	Clock,
	Download,
	Eye,
	MapPin,
} from 'lucide-react';
import Button from './Button';

export default function TicketCard({ data }) {
	const { name, type, date, time, location, seat } = data;
	return (
		<div className='card w-fit  bg-base-100 card-md shadow-sm'>
			<div className='card-body'>
				<div className='flex justify-between items-center'>
					<h2 className='card-title'>{name}</h2>
					<span className='badge bg-gray-200'>{type}</span>
				</div>
				<div className='flex gap-5'>
					<div className='flex gap-1 items-center'>
						<Calendar />
						<p>{date}</p>
					</div>
					<div className='flex gap-1 items-center'>
						<Clock />
						<p>{time}</p>
					</div>
					<div className='flex gap-1'>
						<MapPin />
						<p>{location}</p>
					</div>
				</div>
				<div className='flex mt-10 items-center gap-32'>
					<p className=' text-gray-700'>Seat: {seat}</p>
					<div className='justify-end card-actions'>
						<Button className='bg-white text-black'>
							<Download />
							Download
						</Button>
						<Button className='btn btn-primary'>
							<Eye />
							View Ticket
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
