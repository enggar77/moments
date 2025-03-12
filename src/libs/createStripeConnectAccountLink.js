// Function to create a Stripe Connect account link for onboarding
import { stripe } from './stripe';
import getBaseUrl from './baseUrl';

export async function createStripeConnectAccountLink(account) {
  try {
    const origin = getBaseUrl();

    const accountLink = await stripe.accountLinks.create({
      account,
      refresh_url: `${origin}/connect/refresh/${account}`,
      return_url: `${origin}/connect/return/${account}`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account link:',
      error
    );
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
}