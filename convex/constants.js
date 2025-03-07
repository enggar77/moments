// Time constants in milliseconds
export const DURATIONS = {
	TICKET_OFFER: 30 * 60 * 1000, // 30 minutes (Minimum Stripe allows for checkout expiry)
};

// Status types for waiting list entries
export const WAITING_LIST_STATUS = {
	WAITING: 'waiting',
	OFFERED: 'offered',
	PURCHASED: 'purchased',
	EXPIRED: 'expired',
};

export const TICKET_STATUS = {
	VALID: 'valid',
	USED: 'used',
	REFUNDED: 'refunded',
	CANCELLED: 'cancelled',
};

export const ORGANIZER_EMAILS = [
	'alexandrazoe23@gmail.com',
	'ejihandoko@gmail.com',
];
export const ADMIN_EMAILS = [
	'jihandokoenggar@gmail.com',
	'ronaldo.s.n666@gmail.com',
	'akhmadramedhon31jl@gmail.com',
];
