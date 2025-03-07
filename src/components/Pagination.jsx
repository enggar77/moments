import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ activePage, totalPages, onPageChange }) {
	const handlePrev = () => {
		if (activePage > 1) onPageChange(activePage - 1);
	};

	const handleNext = () => {
		if (activePage < totalPages) onPageChange(activePage + 1);
	};

	return (
		<div className="flex justify-center gap-2 mt-8">
			<button
				onClick={handlePrev}
				disabled={activePage === 1}
				className={`join-item btn w-8 p-1 ${
					activePage === 1
						? 'bg-white text-black border border-gray-300 cursor-not-allowed'
						: 'bg-white text-black hover:bg-gray-200'
				}`}
			>
				<ChevronLeft />
			</button>

			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`join-item btn ${
						activePage === page
							? 'bg-black text-white border border-black'
							: 'bg-white text-black border border-gray-300 hover:bg-gray-200'
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={handleNext}
				disabled={activePage === totalPages}
				className={`join-item btn w-8 p-1 ${
					activePage === totalPages
						? 'bg-white text-black border border-gray-300 cursor-not-allowed'
						: 'bg-white text-black hover:bg-gray-200'
				}`}
			>
				<ChevronRight />
			</button>
		</div>
	);
}
