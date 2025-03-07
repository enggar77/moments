// Function to check the status of a Stripe Connect account
import { stripe } from './stripe';

export const AccountStatus = {
  isActive: false,
  requiresInformation: false,
  requirements: {
    currently_due: [],
    eventually_due: [],
    past_due: [],
  },
  chargesEnabled: false,
  payoutsEnabled: false,
};

export async function getStripeConnectAccountStatus(stripeAccountId) {
  if (!stripeAccountId) {
    throw new Error('No Stripe account ID provided');
  }

  try {
    const account = await stripe.accounts.retrieve(stripeAccountId);

    return {
      isActive:
        account.details_submitted &&
        !account.requirements?.currently_due?.length,
      requiresInformation: !!(account.requirements?.currently_due?.length ||
        account.requirements?.eventually_due?.length ||
        account.requirements?.past_due?.length),
      requirements: {
        currently_due: account.requirements?.currently_due || [],
        eventually_due: account.requirements?.eventually_due || [],
        past_due: account.requirements?.past_due || [],
      },
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  } catch (error) {
    console.error('Error fetching Stripe Connect account status:', error);
    throw new Error('Failed to fetch Stripe Connect account status');
  }
}