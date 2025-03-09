import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import ReleaseTicket from './ReleaseTicket';
import { useLocation } from 'react-router';
import Button from '../Button';
import { createStripeCheckoutSession } from '../../libs/createStripeCheckoutSession';

export default function PurchaseTicket({ eventId }) {
	const { pathname } = useLocation();
	const { user } = useUser();
	const queuePosition = useQuery(api.waitingList.getQueuePosition, {
		eventId,
		userId: user?.id ?? '',
	});

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

	const handlePurchase = async () => {
		if (!user) return;
		try {
			setIsLoading(true);
			const { sessionUrl } = await createStripeCheckoutSession({
				eventId,
				userId: user.id,
			});
			if (sessionUrl) {
				window.location.href = sessionUrl;
			}
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
