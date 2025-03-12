import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SearchBar() {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			navigate(`/search?q=${encodeURIComponent(query.trim())}`);
		}
		setQuery('');
	};

	return (
		<form onSubmit={handleSearch} className="relative w-full md:w-auto">
			<input
				type="text"
				placeholder="Search for events..."
				className="input w-full lg:w-96 pl-10 input-md"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<Search className="text-base-content/30 absolute left-3 top-2 w-4" />
		</form>
	);
}
