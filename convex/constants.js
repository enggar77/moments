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
	'purnamasrahayu@gmail.com',
	'411221090@mahasiswa.undira.ac.id',
	'ronaldajha007@gmail.com',
];
