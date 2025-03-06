import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const ORGANIZER_EMAILS = ['jihandokoenggar@gmail.com'];
export const ADMIN_EMAILS = ['ejihandoko@gmail.com'];

export function useStorageUrl(storageId) {
	return useQuery(api.storage.getUrl, storageId ? { storageId } : 'skip');
}
