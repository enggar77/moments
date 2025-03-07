import { stripe } from './stripe';
import { getConvexClient } from './convex';
import { api } from '../../convex/_generated/api';

export async function createStripeConnectCustomer({ userId }) {
	if (!userId) {
		throw new Error('Not authenticated');
	}

	const convex = getConvexClient();

	// Check for existing Stripe Connect account
	const existingStripeConnectId = await convex.query(
		api.users.getUsersStripeConnectId,
		{ userId }
	);

	if (existingStripeConnectId) {
		return { account: existingStripeConnectId };
	}

	// Create new Stripe Connect account
	const account = await stripe.accounts.create({
		type: 'express',
		capabilities: {
			card_payments: { requested: true },
			transfers: { requested: true },
		},
		tos_acceptance: {
			service_agreement: 'full',
		},
	});

	// Update user record with new Stripe Connect ID
	await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
		userId,
		stripeConnectId: account.id,
	});

	return { account: account.id };
}
