import { useState } from 'react';
import { ChevronLeft, ChevronRight, PersonStanding } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import EditUser from '../../components/EditUser';
import SearchBar from '../../components/SearchBar';

const ITEMS_PER_PAGE = 10;
const defaultAvatar =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgr9-7PZSm240VMDVsathNHVdCabXvMCxsA&s';

export default function AdminUserManagement() {
	const [isOpen, setIsOpen] = useState(false);
	const usersData = useQuery(api.users.getAllUsers);
	const [selectedUser, setSelectedUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [sortBy, setSortBy] = useState('name');
	const [currentPage, setCurrentPage] = useState(1);

	if (!usersData) {
		return <Loading />;
	}

	function handleEdit(user) {
		setSelectedUser(user);
		setIsOpen(true);
	}
	// const [users, setUsers] = useState(usersData);

	// const toggleStatus = (id) => {
	// 	setUsers(
	// 		users.map((user) =>
	// 			user.id === id
	// 				? {
	// 						...user,
	// 						status:
	// 							user.status === 'Active' ? 'Blocked' : 'Active',
	// 					}
	// 				: user
	// 		)
	// 	);
	// };

	const filteredUsers = usersData.filter(
		(user) =>
			(roleFilter === 'all' || user.role === roleFilter) &&
			(user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const sortedUsers = [...filteredUsers].sort((a, b) => {
		if (sortBy === 'name') return a.name.localeCompare(b.name);
		if (sortBy === 'email') return a.email.localeCompare(b.email);
		if (sortBy === 'role') return a.role.localeCompare(b.role);
		return 0;
	});

	const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
	const currentData = sortedUsers.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="p-6 w-full max-w-full">
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex flex-row justify-between items-center gap-4 mb-4">
					<SearchBar
						setSearchTerm={setSearchTerm}
						placeholder="Search users..."
					/>
					<div className="flex gap-2">
						<select
							className="select select-bordered text-sm"
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
						>
							<option value="all">All</option>
							<option value="user">User</option>
							<option value="organizer">Organizer</option>
							<option value="admin">Admin</option>
						</select>

						<select
							className="select select-bordered text-sm"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="name">Name</option>
							<option value="email">Email</option>
							<option value="role">Role</option>
						</select>
					</div>
				</div>

				<div className="overflow-x-auto w-full">
					<table className="table table-auto min-w-max text-xs sm:text-sm">
						<thead className="bg-gray-100">
							<tr>
								<th>User</th>
								<th>Email</th>
								<th>Role</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentData.map((user) => (
								<tr key={user._id}>
									<td className="flex items-center gap-3 p-3">
										<img
											src={user.avatar || defaultAvatar}
											alt="avatar"
											className="rounded-full w-10 h-10 border"
										/>
										{user.name}
									</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td className="flex gap-2">
										<Button
											className={`btn btn-sm btn-warning`}
											onClick={() => handleEdit(user)}
										>
											Edit
										</Button>
										<Button
											// onClick={() =>
											// 	toggleStatus(user.id)
											// }
											className={`btn btn-sm btn-error`}
										>
											{user.status !== 'Active'
												? 'Block'
												: 'Unblock'}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{isOpen && (
					<>
						<EditUser setIsOpen={setIsOpen} user={selectedUser} />
					</>
				)}

				<div className="flex justify-between items-center mt-4">
					<p>
						Showing {usersData.length} of {usersData.length} users
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
