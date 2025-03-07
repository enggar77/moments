import { stripe } from './stripe';
import { getConvexClient } from './convex';
import { api } from '../../convex/_generated/api';
import baseUrl from './baseUrl';
import { DURATIONS } from '../../convex/constants';

export async function createStripeCheckoutSession({ eventId, userId }) {
	const convex = getConvexClient();

	// Get event details
	const event = await convex.query(api.events.getById, { eventId });
	if (!event) throw new Error('Event not found');

	// Get waiting list entry
	const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
		eventId,
		userId,
	});

	if (!queuePosition || queuePosition.status !== 'offered') {
		throw new Error('No valid ticket offer found');
	}

	const stripeConnectId = await convex.query(
		api.users.getUsersStripeConnectId,
		{
			userId: event.userId,
		}
	);

	if (!stripeConnectId) {
		throw new Error('Stripe Connect ID not found for owner of the event!');
	}

	if (!queuePosition.offerExpiresAt) {
		throw new Error('Ticket offer has no expiration date');
	}

	const metadata = {
		eventId,
		userId,
		waitingListId: queuePosition._id,
	};

	// Create Stripe Checkout Session
	const session = await stripe.checkout.sessions.create(
		{
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'sgd',
						product_data: {
							name: event.name,
							description: event.description,
						},
						unit_amount: Math.round(event.price * 100),
					},
					quantity: 1,
				},
			],
			payment_intent_data: {
				application_fee_amount: Math.round(event.price * 100 * 0.01),
			},
			expires_at:
				Math.floor(Date.now() / 1000) + DURATIONS.TICKET_OFFER / 1000, // 30 minutes (stripe checkout minimum expiration time)
			mode: 'payment',
			success_url: `${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${baseUrl}/event/${eventId}`,
			metadata,
		},
		{
			stripeAccount: stripeConnectId,
		}
	);

	return { sessionId: session.id, sessionUrl: session.url };
}
