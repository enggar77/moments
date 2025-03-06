import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const transactions = [
	{
		id: '#TRX-2025001',
		customer: 'Albus Dumbledore',
		avatar: 'https://i.pinimg.com/736x/5c/be/65/5cbe6552d5daac313d946c61eab61be9.jpg',
		concert: 'Rock Festival 2025',
		date: 'Jan 15, 2025',
		amount: '$89.00',
		status: 'Completed',
	},
	{
		id: '#TRX-2025002',
		customer: 'Tom Riddle',
		avatar: 'https://i.pinimg.com/736x/72/2c/ff/722cfff5b9af8335fe6f3c0bcf8cface.jpg',
		concert: 'Jazz Night 2025',
		date: 'Jan 16, 2025',
		amount: '$150.00',
		status: 'Pending',
	},
	{
		id: '#TRX-2025003',
		customer: 'Harry potter',
		avatar: 'https://i.pinimg.com/736x/f7/53/38/f75338daeb9f40f3d1fb5bce328d5d14.jpg',
		concert: 'Pop Show 2025',
		date: 'Jan 17, 2025',
		amount: '$75.00',
		status: 'Failed',
	},
];

const statusColors = {
	Completed: 'badge badge-success',
	Pending: 'badge badge-warning',
	Failed: 'badge badge-error',
};

export default function TransactionManagement() {
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('All');
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const filteredTransactions = transactions.filter(
		(t) =>
			t.customer.toLowerCase().includes(search.toLowerCase()) &&
			(statusFilter === 'All' || t.status === statusFilter)
	);

	useEffect(() => {
		document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
	}, [isSidebarOpen]);

	return (
		<div className="flex flex-col md:flex-row">
			<button
				className="md:hidden btn btn-primary m-4"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				{isSidebarOpen ? 'Close Menu' : 'Open Menu'}
			</button>
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>
			<main className="p-6 flex-1">
				<h2 className="text-2xl font-bold mb-6">
					Transactions Management
				</h2>
				<div className="flex flex-col md:flex-row gap-4 mb-4">
					<input
						type="text"
						placeholder="Search transactions..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="input input-bordered w-full md:w-80"
					/>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="select select-bordered"
					>
						<option>All</option>
						<option>Completed</option>
						<option>Pending</option>
						<option>Failed</option>
					</select>
					<button className="btn btn-neutral">Export</button>
				</div>
				<div className="overflow-x-auto">
					<table className="table table-zebra w-full">
						<thead>
							<tr>
								<th>Transaction ID</th>
								<th>User Name</th>
								<th>Concert</th>
								<th>Purchase Date</th>
								<th>Amount</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredTransactions.map((transaction) => (
								<tr
									key={transaction.id}
									className="text-center"
								>
									<td>{transaction.id}</td>
									<td className="flex items-center gap-2">
										<img
											src={transaction.avatar}
											alt={transaction.customer}
											className="w-8 h-8 rounded-full"
										/>
										{transaction.customer}
									</td>
									<td>{transaction.concert}</td>
									<td>{transaction.date}</td>
									<td>{transaction.amount}</td>
									<td>
										<span
											className={
												statusColors[transaction.status]
											}
										>
											{transaction.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="mt-4 flex justify-between items-center">
					<span>Showing 1 to 3 of 150 entries</span>
					<div className="join">
						<button className="btn">Previous</button>
						<button className="btn btn-active">1</button>
						<button className="btn">2</button>
						<button className="btn">3</button>
						<button className="btn">Next</button>
					</div>
				</div>
			</main>
		</div>
	);
}
