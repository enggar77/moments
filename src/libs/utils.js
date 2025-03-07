import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const ORGANIZER_EMAILS = ['alexandrazoe23@gmail.com'];
export const ADMIN_EMAILS = [
	'jihandokoenggar@gmail.com',
	'ronaldo.s.n666@gmail.com',
	'akhmadramedhon31jl@gmail.com',
];

export function useStorageUrl(storageId) {
	return useQuery(api.storage.getUrl, storageId ? { storageId } : 'skip');
}
