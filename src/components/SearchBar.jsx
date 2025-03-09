import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar({
	setSearchTerm,
	placeholder = 'Search for events...',
}) {
	const [inputValue, setInputValue] = useState('');
	const debouncedValue = useDebounce(inputValue, 500);

	useEffect(() => {
		setSearchTerm(debouncedValue);
	}, [debouncedValue, setSearchTerm]);

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
