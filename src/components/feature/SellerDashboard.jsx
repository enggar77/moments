import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Loading from '../Loading';
import { createStripeConnectAccount } from '../../libs/createStripeConnectAccount';
import { createStripeConnectAccountLink } from '../../libs/createStripeConnectAccountLink';
import { createStripeConnectLoginLink } from '../../libs/createStripeConnectLoginLink';
import { getStripeConnectAccountStatus } from '../../libs/getStripeConnectAccountStatus';
import Header from './seller-dashboard/Header';
import PaymentReadySection from './seller-dashboard/PaymentReadySection';
import AccountCreationSection from './seller-dashboard/AccountCreationSection';
import AccountStatusSection from './seller-dashboard/AccountStatusSection';
import ActionButtons from './seller-dashboard/ActionButtons';
import RequirementsList from './seller-dashboard/RequirementsList';

export default function SellerDashboard() {
	const [accountCreatePending, setAccountCreatePending] = useState(false);
	const [accountLinkCreatePending, setAccountLinkCreatePending] =
		useState(false);
	const [error, setError] = useState(false);
	const [accountStatus, setAccountStatus] = useState(null);
	const { user } = useUser();
	const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
		userId: user?.id || '',
	});

	const isReadyToAcceptPayments =
		accountStatus?.isActive && accountStatus?.payoutsEnabled;

	useEffect(() => {
		if (stripeConnectId) {
			fetchAccountStatus();
		}
	}, [stripeConnectId]);

	if (stripeConnectId === undefined) {
		return <Loading />;
	}

	const handleManageAccount = async () => {
		try {
			if (stripeConnectId && accountStatus?.isActive) {
				const loginUrl =
					await createStripeConnectLoginLink(stripeConnectId);
				window.location.href = loginUrl;
			}
		} catch (error) {
			console.error('Error accessing Stripe Connect portal:', error);
			setError(true);
		}
	};

	const handleCreateAccount = async () => {
		setAccountCreatePending(true);
		setError(false);
		try {
			await createStripeConnectAccount(user.id);
			setAccountCreatePending(false);
			// Refresh the page to get the updated stripeConnectId
			window.location.reload();
		} catch (error) {
			console.error('Error creating Stripe Connect account:', error);
			setError(true);
			setAccountCreatePending(false);
		}
	};

	const handleCompleteOnboarding = async () => {
		setAccountLinkCreatePending(true);
		setError(false);
		try {
			const { url } =
				await createStripeConnectAccountLink(stripeConnectId);
			window.location.href = url;
		} catch (error) {
			console.error('Error creating Stripe Connect account link:', error);
			setError(true);
			setAccountLinkCreatePending(false);
		}
	};

	const fetchAccountStatus = async () => {
		if (stripeConnectId) {
			try {
				const status =
					await getStripeConnectAccountStatus(stripeConnectId);
				setAccountStatus(status);
			} catch (error) {
				console.error('Error fetching account status:', error);
			}
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-lg overflow-hidden">
				<Header />

				{/* Main Content */}
				{isReadyToAcceptPayments && <PaymentReadySection />}

				<div className="p-6">
					{/* Account Creation Section */}
					{!stripeConnectId && !accountCreatePending && (
						<AccountCreationSection
							onCreateAccount={handleCreateAccount}
							isLoading={accountCreatePending}
						/>
					)}

					{/* Account Status Section */}
					{stripeConnectId && accountStatus && (
						<div className="space-y-6">
							<AccountStatusSection
								accountStatus={accountStatus}
							/>

							{/* Action Buttons */}
							<ActionButtons
								accountStatus={accountStatus}
								onCompleteOnboarding={handleCompleteOnboarding}
								onManageAccount={handleManageAccount}
								isLinkCreatePending={accountLinkCreatePending}
							/>

							{/* Requirements List */}
							{accountStatus.requiresInformation && (
								<RequirementsList
									requirements={accountStatus.requirements}
								/>
							)}
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
							There was an error processing your request. Please
							try again.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
