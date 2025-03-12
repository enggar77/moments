// In your PurchaseTicket.jsx component
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../../../convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import ReleaseTicket from './ReleaseTicket';
import { useLocation, useNavigate } from 'react-router';
import Button from '../Button';
import { stripe } from '../../libs/stripe';
import { getConvexClient } from '../../libs/convex';
import getBaseUrl from '../../libs/baseUrl';
import { DURATIONS } from '../../../convex/constants';

export default function PurchaseTicket({ eventId }) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { user } = useUser();
	const queuePosition = useQuery(api.waitingList.getQueuePosition, {
		eventId,
		userId: user?.id ?? '',
	});
	const event = useQuery(api.events.getById, { eventId });

	// Add the purchaseTicket mutation
	const purchaseTicketMutation = useMutation(api.events.purchaseTicket);

	const [timeRemaining, setTimeRemaining] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
	const isExpired = Date.now() > offerExpiresAt;

	useEffect(() => {
		const calculateTimeRemaining = () => {
			if (isExpired) {
				setTimeRemaining('Expired');
				return;
			}

			const diff = offerExpiresAt - Date.now();
			const minutes = Math.floor(diff / 1000 / 60);
			const seconds = Math.floor((diff / 1000) % 60);

			if (minutes > 0) {
				setTimeRemaining(
					`${minutes} minute${minutes === 1 ? '' : 's'} ${seconds} second${
						seconds === 1 ? '' : 's'
					}`
				);
			} else {
				setTimeRemaining(
					`${seconds} second${seconds === 1 ? '' : 's'}`
				);
			}
		};

		calculateTimeRemaining();
		const interval = setInterval(calculateTimeRemaining, 1000);
		return () => clearInterval(interval);
	}, [offerExpiresAt, isExpired]);

	// Check for Stripe session ID in URL when component mounts or route changes
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const sessionId = urlParams.get('session_id');

		if (sessionId && user && queuePosition) {
			handleSuccessfulPayment(sessionId);
		}
	}, [window.location.search, user, queuePosition]);

	const handleSuccessfulPayment = async (sessionId) => {
		try {
			// Get payment details from session
			// In a real application, you might want to verify the payment status

			// Create ticket directly
			await purchaseTicketMutation({
				eventId,
				userId: user.id,
				waitingListId: queuePosition._id,
				paymentInfo: {
					paymentIntentId: sessionId,
					amount: event?.price || 0,
				},
			});

			navigate('/ticket/purchase-success', { replace: true });
		} catch (error) {
			console.error('Error processing successful payment:', error);
		}
	};

	const handlePurchase = async () => {
		if (!user || !event) return;
		try {
			setIsLoading(true);

			// Get seller's Stripe Connect ID
			const convex = getConvexClient();
			const stripeConnectId = await convex.query(
				api.users.getUsersStripeConnectId,
				{
					userId: event.userId,
				}
			);

			if (!stripeConnectId) {
				throw new Error(
					'Stripe Connect ID not found for event creator'
				);
			}

			const baseUrl = getBaseUrl();

			// Create Stripe checkout session
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
						application_fee_amount: Math.round(
							event.price * 100 * 0.01
						),
					},
					expires_at:
						Math.floor(Date.now() / 1000) +
						DURATIONS.TICKET_OFFER / 1000,
					mode: 'payment',
					// Critical: include session_id in the return URL
					success_url: `${baseUrl}/event/${eventId}?session_id={CHECKOUT_SESSION_ID}`,
					cancel_url: `${baseUrl}/event/${eventId}`,
					metadata: {
						eventId,
						userId: user.id,
						waitingListId: queuePosition._id,
					},
				},
				{
					stripeAccount: stripeConnectId,
				}
			);

			// Redirect to checkout
			window.location.href = session.url;
		} catch (error) {
			console.error('Error creating checkout session:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!user || !queuePosition || queuePosition.status !== 'offered') {
		return null;
	}

	return (
		<div className="p-5 border-warning/50 border rounded">
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">Ticket Reserved</h3>
					<p className="text-sm text-error">
						Expires in {timeRemaining}
					</p>
				</div>

				{pathname.includes('event/') && (
					<>
						<div className="text-sm text-gray-600 leading-relaxed">
							A ticket has been reserved for you. Complete your
							purchase before the timer expires to secure your
							spot at this event.
						</div>

						<Button
							onClick={handlePurchase}
							disabled={isExpired || isLoading}
							className="btn-lg btn-warning w-full"
						>
							{isLoading
								? 'Redirecting to checkout...'
								: 'Purchase Your Ticket Now →'}
						</Button>

						<div className="">
							<ReleaseTicket
								eventId={eventId}
								waitingListId={queuePosition._id}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
