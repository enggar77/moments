import Stripe from 'stripe';

if (!import.meta.env.STRIPE_SECRET_KEY) {
	throw new Error('STRIPE Secret key is missing in enviroment variables');
}

export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-02-24.acacia',
});
