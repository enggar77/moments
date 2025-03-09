import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({
	placeholder = 'Search for events...',
}) {
	const [inputValue, setInputValue] = useState('');

	return (
		<form action="/search" className="relative w-full md:w-auto">
			<input
				type="text"
				placeholder={placeholder}
				className="input w-full lg:w-96 pl-10 input-md"
				name="q"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<Search className="text-base-content/30 absolute left-3 top-2 w-4" />
		</form>
	);
}
