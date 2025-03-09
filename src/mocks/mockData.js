export const mockDataEvent = {
	name: 'Mock Event',
	description: 'Mock description',
	location: 'Mock location',
	eventDate: Date.now(),
	price: 200,
	totalTickets: 10,
	userId: '123',
	is_cancelled: false,
};

export const mockAvailability = {
	totalTickets: 10,
	purchasedCount: 2,
};

export const mockUser = {
	name: 'Mock user',
	role: 'admin',
	email: 'mock@mail.com',
};

export const mockUsers = [
	{
		_id: '1',
		name: 'Alice Johnson',
		email: 'alice@example.com',
		role: 'admin',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '2',
		name: 'Bob Smith',
		email: 'bob@example.com',
		role: 'user',
		status: 'Active',
		avatar: 'avatar-url',
	},
	{
		_id: '3',
		name: 'Charlie Brown',
		email: 'charlie@example.com',
		role: 'organizer',
		status: 'Blocked',
		avatar: null,
	},
	{
		_id: '4',
		name: 'Diana Prince',
		email: 'diana@example.com',
		role: 'user',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '5',
		name: 'Evan Williams',
		email: 'evan@example.com',
		role: 'organizer',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '6',
		name: 'Frank Castle',
		email: 'frank@example.com',
		role: 'user',
		status: 'Blocked',
		avatar: null,
	},
	{
		_id: '7',
		name: 'Grace Lee',
		email: 'grace@example.com',
		role: 'admin',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '8',
		name: 'Henry Ford',
		email: 'henry@example.com',
		role: 'user',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '9',
		name: 'Irene Adler',
		email: 'irene@example.com',
		role: 'organizer',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '10',
		name: 'Jack Ryan',
		email: 'jack@example.com',
		role: 'user',
		status: 'Active',
		avatar: null,
	},
	{
		_id: '11',
		name: 'Kate Bishop',
		email: 'kate@example.com',
		role: 'admin',
		status: 'Active',
		avatar: null,
	},
];
