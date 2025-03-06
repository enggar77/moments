import { Form } from 'react-router';
import Button from './Button';
import { Search } from 'lucide-react';

export default function SearchBar() {
	return (
		<Form action="/search" className="relative w-full md:w-auto">
			<input
				type="text"
				placeholder="Search for events..."
				className="input  w-full lg:w-96 pl-10"
				name="q"
			/>
			<Search className="text-base-content/30 absolute left-3 top-2 w-4" />
		</Form>
	);
}
