import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router';
import FormEvent from '../components/FormEvent';

export default function EditEvent() {
	return (
		<div className="p-6">
			<div className="flex items-center gap-2 mb-10">
				<Button className="bg-gray-100 text-black p-0.5 border-none hover:bg-gray-200">
					<Link to="/">
						<ArrowLeft />
					</Link>
				</Button>
				<h1 className="text-3xl">Edit Event</h1>
			</div>

			{/* Form Input */}
			<FormEvent />
		</div>
	);
}
