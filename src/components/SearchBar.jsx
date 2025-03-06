import { Form } from 'react-router';
import { Search } from 'lucide-react';

export default function SearchBar() {
	return (
		<Form action="/search" className="relative">
			<input
				type="text"
				placeholder="Search for events..."
				className="input w-full lg:w-96 pl-10 input-md"
				name="q"
			/>
			<Search className="text-base-content/30 absolute left-3 top-2 w-4" />
		</Form>
	);
}
