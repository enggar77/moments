// Function to create a Stripe Connect account for sellers/organizers
import { stripe } from './stripe';
import { getConvexClient } from './convex';
import { api } from '../../convex/_generated/api';

export async function createStripeConnectAccount(userId) {
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const convex = getConvexClient();

  // Check if user already has a connect account
  const existingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId,
    }
  );

  if (existingStripeConnectId) {
    return { account: existingStripeConnectId };
  }

  // Create new connect account
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    // Add terms of service acceptance to comply with Stripe requirements
    tos_acceptance: {
      service_agreement: 'full',
    },
  });

  // Update user with stripe connect id
  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });

  return { account: account.id };
}