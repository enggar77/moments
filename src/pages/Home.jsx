import EventList from '../components/EventList';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';

export default function Home() {
	return (
		<div>
			<Hero />
			<section className="pt-[75vh]">
				<div className="flex justify-end px-4 md:px-10 mb-5">
					<SearchBar />
				</div>
				<EventList />
			</section>
		</div>
	);
}
