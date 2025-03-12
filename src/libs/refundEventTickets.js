import { stripe } from './stripe';
import { getConvexClient } from '../libs/convex';
import { api } from '../../convex/_generated/api';

export async function refundEventTickets(eventId) {
	const convex = getConvexClient();

	// Get event details
	const event = await convex.query(api.events.getById, { eventId });
	if (!event) throw new Error('Event not found');

	// Get event owner's Stripe Connect ID
	const stripeConnectId = await convex.query(
		api.users.getUsersStripeConnectId,
		{
			userId: event.userId,
		}
	);

	if (!stripeConnectId) {
		throw new Error('Stripe Connect ID not found');
	}

	// Get all valid tickets for this event
	const tickets = await convex.query(api.tickets.getValidTicketsForEvent, {
		eventId,
	});

	// Process refunds for each ticket
	const results = await Promise.allSettled(
		tickets.map(async (ticket) => {
			try {
				if (!ticket.paymentIntentId) {
					throw new Error('Payment information not found');
				}

				// Check if the paymentIntentId is a session ID instead of a payment intent
				let paymentIntentId = ticket.paymentIntentId;

				// If it starts with 'cs_', it's a checkout session ID, not a payment intent
				if (paymentIntentId.startsWith('cs_')) {
					try {
						// Retrieve the session to get the payment intent ID
						const session = await stripe.checkout.sessions.retrieve(
							paymentIntentId,
							{
								stripeAccount: stripeConnectId,
							}
						);

						// Get the actual payment intent ID from the session
						if (session.payment_intent) {
							paymentIntentId = session.payment_intent;
						} else {
							throw new Error(
								'Payment intent not found in session'
							);
						}
					} catch (sessionError) {
						console.error(
							`Failed to retrieve session ${paymentIntentId}:`,
							sessionError
						);
						throw new Error(
							`Invalid session ID: ${sessionError.message}`
						);
					}
				}

				// Issue refund through Stripe
				await stripe.refunds.create(
					{
						payment_intent: paymentIntentId,
						reason: 'requested_by_customer',
					},
					{
						stripeAccount: stripeConnectId,
					}
				);

				// Update ticket status to refunded
				await convex.mutation(api.tickets.updateTicketStatus, {
					ticketId: ticket._id,
					status: 'refunded',
				});

				return { success: true, ticketId: ticket._id };
			} catch (error) {
				console.error(`Failed to refund ticket ${ticket._id}:`, error);
				return { success: false, ticketId: ticket._id, error };
			}
		})
	);

	// Check if all refunds were successful
	const failedRefunds = results.filter(
		(result) => result.status !== 'fulfilled' || !result.value.success
	);

	if (failedRefunds.length > 0) {
		// Collect detailed error information
		const failedTicketDetails = failedRefunds
			.map((result) => {
				if (result.status === 'rejected') {
					return `Ticket processing failed: ${result.reason}`;
				} else {
					return `Ticket ${result.value.ticketId} failed: ${result.value.error?.message || 'Unknown error'}`;
				}
			})
			.join('\n');

		throw new Error(
			`Some refunds failed. Please check the following issues:\n${failedTicketDetails}`
		);
	}

	// Double-check that all tickets are now refunded
	const remainingActiveTickets = await convex.query(
		api.tickets.getValidTicketsForEvent,
		{
			eventId,
		}
	);

	if (remainingActiveTickets.length > 0) {
		throw new Error(
			`Still found ${remainingActiveTickets.length} active tickets after refund process. Cannot cancel event.`
		);
	}

	// Cancel the event instead of deleting it
	await convex.mutation(api.events.cancelEvent, { eventId });

	return { success: true };
}
