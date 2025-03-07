import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const usersData = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john.doe@example.com',
		date: 'Jan 15, 2025',
		purchases: 23,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 23,
		name: 'Sarah Smith',
		email: 'sarah.smith@example.com',
		date: 'Feb 3, 2025',
		purchases: 15,
		status: 'Blocked',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 33,
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		date: 'Mar 21, 2025',
		purchases: 8,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 14,
		name: 'John Doe',
		email: 'john.doe@example.com',
		date: 'Jan 15, 2025',
		purchases: 23,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 24,
		name: 'Sarah Smith',
		email: 'sarah.smith@example.com',
		date: 'Feb 3, 2025',
		purchases: 15,
		status: 'Blocked',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 35,
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		date: 'Mar 21, 2025',
		purchases: 8,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 15,
		name: 'John Doe',
		email: 'john.doe@example.com',
		date: 'Jan 15, 2025',
		purchases: 23,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 26,
		name: 'Sarah Smith',
		email: 'sarah.smith@example.com',
		date: 'Feb 3, 2025',
		purchases: 15,
		status: 'Blocked',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 36,
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		date: 'Mar 21, 2025',
		purchases: 8,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 17,
		name: 'John Doe',
		email: 'john.doe@example.com',
		date: 'Jan 15, 2025',
		purchases: 23,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 27,
		name: 'Sarah Smith',
		email: 'sarah.smith@example.com',
		date: 'Feb 3, 2025',
		purchases: 15,
		status: 'Blocked',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
	{
		id: 38,
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		date: 'Mar 21, 2025',
		purchases: 8,
		status: 'Active',
		avatar: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
	},
];

const ITEMS_PER_PAGE = 10;

export default function AdminUserManagement() {
	const userDatas = useQuery(api.users.getAllUsers);
	const [users, setUsers] = useState(usersData);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('All');
	const [sortBy, setSortBy] = useState('Latest');

	const toggleStatus = (id) => {
		setUsers(
			users.map((user) =>
				user.id === id
					? {
							...user,
							status:
								user.status === 'Active' ? 'Blocked' : 'Active',
						}
					: user
			)
		);
	};

	const filteredUsers = users.filter(
		(user) =>
			(statusFilter === 'All' || user.status === statusFilter) &&
			(user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const sortedUsers = [...filteredUsers].sort((a, b) => {
		if (sortBy === 'Latest') return new Date(b.date) - new Date(a.date);
		if (sortBy === 'Name') return a.name.localeCompare(b.name);
		if (sortBy === 'Purchases') return b.purchases - a.purchases;
		return 0;
	});

	const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
	const currentData = sortedUsers.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="p-6 block">
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex flex-row justify-between items-center gap-4">
					<input
						type="text"
						placeholder="Search users..."
						className="input input-bordered "
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className="flex gap-2">
						<select
							className="select select-bordered text-sm"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option>All</option>
							<option>Active</option>
							<option>Blocked</option>
						</select>
						<select
							className="select select-bordered text-sm"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option>Latest</option>
							<option>Name</option>
							<option>Purchases</option>
						</select>
					</div>
				</div>

				<div className="overflow-x-auto mt-6">
					<table className="table w-full">
						<thead className="bg-gray-100">
							<tr>
								<th>User</th>
								<th>Email</th>
								<th>Registration Date</th>
								<th>Purchases</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentData.map((user) => (
								<tr key={user.id}>
									<td className="flex items-center gap-3 p-3">
										<img
											src={user.avatar}
											alt="avatar"
											className="rounded-full w-10 h-10 border"
										/>
										{user.name}
									</td>
									<td>{user.email}</td>
									<td>{user.date}</td>
									<td>{user.purchases}</td>
									<td>
										<span
											className={`badge px-3 py-1 rounded-mg text-sm `}
										>
											{user.status}
										</span>
									</td>
									<td>
										<button
											onClick={() =>
												toggleStatus(user.id)
											}
											className={`btn btn-sm ${user.status === 'Active' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
										>
											{user.status === 'Active'
												? 'Block'
												: 'Unblock'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex justify-between items-center mt-4">
					<p>
						Showing {currentData.length} of {users.length} users
					</p>
					<div className="join gap-2">
						<button
							className="btn btn-sm rounded-md w-20 hover:border-black hover:bg-white"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(currentPage - 1)}
						>
							<ChevronLeft size={16} /> Previous
						</button>
						{[...Array(totalPages)].map((_, index) => (
							<button
								key={index}
								className={`btn btn-sm rounded-md ${currentPage === index + 1 ? 'btn-active bg-black text-white' : ''}`}
								onClick={() => setCurrentPage(index + 1)}
							>
								{index + 1}
							</button>
						))}
						<button
							className="btn btn-sm rounded-md w-20 hover:border-black hover:bg-white"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage(currentPage + 1)}
						>
							Next <ChevronRight size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
