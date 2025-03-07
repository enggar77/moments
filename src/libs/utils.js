import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useStorageUrl(storageId) {
	return useQuery(api.storage.getUrl, storageId ? { storageId } : 'skip');
}
