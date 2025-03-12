import { ConvexHttpClient } from 'convex/browser';

export function getConvexClient() {
	if (!import.meta.env.VITE_CONVEX_URL) {
		throw new Error('VITE_CONVEX_URL is not set');
	}

	return new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);
}
