import { useState } from 'react';
import EventList from '../components/EventList';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';

export default function Home() {
	const [searchTerm, setSearchTerm] = useState('');
	return (
		<div>
			<Hero />
			<section className="pt-[75vh]">
				<div className="flex justify-end px-4 md:px-10 mb-5">
					<SearchBar setSearchTerm={setSearchTerm} />
				</div>
				<EventList searchTerm={searchTerm} />
			</section>
		</div>
	);
}
