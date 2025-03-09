export const mockApi = {
	api: {
		events: {
			get: 'mocked_events_get',
			getById: 'mocked_events_getById',
			create: 'mocked_events_create',
			getEventAvailability: 'mocked_events_getEventAvailability',
		},
		users: {
			getUser: 'mocked_users_getUser',
			getAllUsers: 'mocked_users_getAllUsers',
		},
		tickets: {
			getUserTicketForEvent: 'mocked_tickets_getUserTicketForEvent',
		},
		waitingList: {
			getQueuePosition: 'mocked_waitingList_getQueuePosition',
		},
		storage: {},
	},
};
