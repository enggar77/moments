export const mockEvent = {
	_id: 'event123',
	name: 'Summer Concert',
	description: 'A fantastic summer concert experience',
	eventDate: Date.now() + 86400000, // tomorrow,
	location: 'Central Park, New York',
	price: 75.0,
	imageStorageId: 'image123',
};

export const mockAvailability = {
	totalTickets: 500,
	purchasedCount: 150,
	activeOffers: 2,
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
		avatar: null,
	},
	{
		_id: '2',
		name: 'Bob Smith',
		email: 'abob@example.com',
		role: 'user',
		avatar: 'avatar-url.com',
	},
	{
		_id: '3',
		name: 'Charlie Brown',
		email: 'charlie@example.com',
		role: 'organizer',
		avatar: null,
	},
	{
		_id: '4',
		name: 'Diana Prince',
		email: 'diana@example.com',
		role: 'user',
		avatar: null,
	},
	{
		_id: '5',
		name: 'Evan Williams',
		email: 'evan@example.com',
		role: 'organizer',
		avatar: null,
	},
	{
		_id: '6',
		name: 'Frank Castle',
		email: 'frank@example.com',
		role: 'user',
		avatar: null,
	},
	{
		_id: '7',
		name: 'Grace Lee',
		email: 'grace@example.com',
		role: 'admin',
		avatar: null,
	},
	{
		_id: '8',
		name: 'Henry Ford',
		email: 'henry@example.com',
		role: 'user',
		avatar: null,
	},
	{
		_id: '9',
		name: 'Irene Adler',
		email: 'irene@example.com',
		role: 'organizer',
		avatar: null,
	},
	{
		_id: '10',
		name: 'Jack Ryan',
		email: 'jack@example.com',
		role: 'user',
		avatar: null,
	},
	{
		_id: '11',
		name: 'Kate Bishop',
		email: 'kate@example.com',
		role: 'admin',
		avatar: null,
	},
];

export const mockEvents = [
	{
		_id: '1',
		name: 'Summer Festival',
		eventDate: new Date('2025-06-15').toISOString(),
		location: 'Central Park',
		price: '$50',
	},
	{
		_id: '2',
		name: 'Rock Concert',
		eventDate: new Date('2025-04-20').toISOString(),
		location: 'Madison Square Garden',
		price: '$75',
	},
	{
		_id: '3',
		name: 'Jazz Night',
		eventDate: new Date('2025-02-10').toISOString(), // past event
		location: 'Blue Note',
		price: '$40',
	},
	{
		_id: '4',
		name: 'Classical Symphony',
		eventDate: new Date('2025-05-30').toISOString(),
		location: 'Carnegie Hall',
		price: '$100',
	},
	{
		_id: '5',
		name: 'Electronic Music Festival',
		eventDate: new Date('2025-07-25').toISOString(),
		location: 'Barclays Center',
		price: '$120',
	},
	{
		_id: '6',
		name: 'Country Music Jam',
		eventDate: new Date('2025-08-15').toISOString(),
		location: 'Nashville Arena',
		price: '$65',
	},
	{
		_id: '7',
		name: 'Indie Band Showcase',
		eventDate: new Date('2025-03-01').toISOString(), // past event
		location: 'Mercury Lounge',
		price: '$25',
	},
	{
		_id: '8',
		name: 'Hip Hop Concert',
		eventDate: new Date('2025-09-10').toISOString(),
		location: 'Barclays Center',
		price: '$90',
	},
	{
		_id: '9',
		name: 'Music Festival',
		eventDate: new Date('2025-06-30').toISOString(),
		location: "Randall's Island",
		price: '$150',
	},
	{
		_id: '10',
		name: 'Pop Star Tour',
		eventDate: new Date('2025-10-05').toISOString(),
		location: 'Madison Square Garden',
		price: '$200',
	},
	{
		_id: '11',
		name: 'Latin Music Night',
		eventDate: new Date('2025-11-15').toISOString(),
		location: 'Beacon Theatre',
		price: '$70',
	},
];

export const soldOutAvailability = {
	totalTickets: 500,
	purchasedCount: 500,
};

export const noDescriptionEvent = {
	...mockEvent,
	description: '',
};

export const mockUserTicket = { _id: 'ticket123' };

export const mockQueuePosition = {
	status: 'waiting',
	position: 5,
};
