import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useNavigate } from 'react-router';
import { CalendarDays, Cog, Plus } from 'lucide-react';
import Loading from '../Loading';
import { createStripeConnectAccount } from '../../libs/createStripeConnectAccount';
import { createStripeConnectAccountLink } from '../../libs/createStripeConnectAccountLink';
import { createStripeConnectLoginLink } from '../../libs/createStripeConnectLoginLink';
import { getStripeConnectAccountStatus } from '../../libs/getStripeConnectAccountStatus';

export default function SellerDashboard() {
	const [accountCreatePending, setAccountCreatePending] = useState(false);
	const [accountLinkCreatePending, setAccountLinkCreatePending] =
		useState(false);
	const [error, setError] = useState(false);
	const [accountStatus, setAccountStatus] = useState(null);
	const navigate = useNavigate();
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
				{/* Header Section */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
					<h2 className="text-2xl font-bold">Seller Dashboard</h2>
					<p className="text-blue-100 mt-2">
						Manage your seller profile and payment settings
					</p>
				</div>

				{/* Main Content */}
				{isReadyToAcceptPayments && (
					<>
						<div className="bg-white p-8 rounded-lg">
							<h2 className="text-2xl font-semibold text-gray-900 mb-6">
								Sell tickets for your events
							</h2>
							<p className="text-gray-600 mb-8">
								List your tickets for sale and manage your
								listings
							</p>
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
								<div className="flex justify-center gap-4">
									<button
										onClick={() =>
											navigate('/create-event')
										}
										className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
									>
										<Plus className="w-5 h-5" />
										Create Event
									</button>
									<button
										onClick={() => navigate('/my-events')}
										className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
									>
										<CalendarDays className="w-5 h-5" />
										View My Events
									</button>
								</div>
							</div>
						</div>

						<hr className="my-8" />
					</>
				)}

				<div className="p-6">
					{/* Account Creation Section */}
					{!stripeConnectId && !accountCreatePending && (
						<div className="text-center py-8">
							<h3 className="text-xl font-semibold mb-4">
								Start Accepting Payments
							</h3>
							<p className="text-gray-600 mb-6">
								Create your seller account to start receiving
								payments securely through Stripe
							</p>
							<button
								onClick={handleCreateAccount}
								className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Create Seller Account
							</button>
						</div>
					)}

					{/* Account Status Section */}
					{stripeConnectId && accountStatus && (
						<div className="space-y-6">
							{/* Status Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Account Status Card */}
								<div className="bg-gray-50 rounded-lg p-4">
									<h3 className="text-sm font-medium text-gray-500">
										Account Status
									</h3>
									<div className="mt-2 flex items-center">
										<div
											className={`w-3 h-3 rounded-full mr-2 ${accountStatus.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}
										/>
										<span className="text-lg font-semibold">
											{accountStatus.isActive
												? 'Active'
												: 'Pending Setup'}
										</span>
									</div>
								</div>

								{/* Payments Status Card */}
								<div className="bg-gray-50 rounded-lg p-4">
									<h3 className="text-sm font-medium text-gray-500">
										Payment Capability
									</h3>
									<div className="mt-2 space-y-1">
										<div className="flex items-center">
											<svg
												className={`w-5 h-5 ${accountStatus.chargesEnabled ? 'text-green-500' : 'text-gray-400'}`}
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											<span className="ml-2">
												{accountStatus.chargesEnabled
													? 'Can accept payments'
													: 'Cannot accept payments yet'}
											</span>
										</div>
										<div className="flex items-center">
											<svg
												className={`w-5 h-5 ${accountStatus.payoutsEnabled ? 'text-green-500' : 'text-gray-400'}`}
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											<span className="ml-2">
												{accountStatus.payoutsEnabled
													? 'Can receive payouts'
													: 'Cannot receive payouts yet'}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col space-y-4">
								{!accountStatus.isActive && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<h3 className="font-medium text-yellow-800">
											Complete your account setup
										</h3>
										<p className="text-sm text-yellow-700 mt-1 mb-3">
											Your Stripe account requires
											additional information before you
											can accept payments.
										</p>
										<button
											onClick={handleCompleteOnboarding}
											disabled={accountLinkCreatePending}
											className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
										>
											{accountLinkCreatePending ? (
												<span className="flex items-center">
													<svg
														className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Processing...
												</span>
											) : (
												'Complete Account Setup'
											)}
										</button>
									</div>
								)}

								{accountStatus.isActive && (
									<button
										onClick={handleManageAccount}
										className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
									>
										<Cog className="w-5 h-5" />
										Manage Stripe Account
									</button>
								)}
							</div>

							{/* Requirements List */}
							{accountStatus.requiresInformation && (
								<div className="mt-4">
									<h3 className="text-sm font-medium text-gray-500 mb-2">
										Required Information
									</h3>
									<div className="bg-gray-50 rounded-lg p-4 space-y-2">
										{accountStatus.requirements
											.currently_due.length > 0 && (
											<div>
												<h4 className="text-xs font-medium text-red-500">
													Currently Due:
												</h4>
												<ul className="text-sm text-gray-600 list-disc pl-5">
													{accountStatus.requirements.currently_due.map(
														(item, index) => (
															<li key={index}>
																{item
																	.split('.')
																	.pop()
																	.replace(
																		/_/g,
																		' '
																	)}
															</li>
														)
													)}
												</ul>
											</div>
										)}

										{accountStatus.requirements
											.eventually_due.length > 0 && (
											<div>
												<h4 className="text-xs font-medium text-orange-500">
													Eventually Due:
												</h4>
												<ul className="text-sm text-gray-600 list-disc pl-5">
													{accountStatus.requirements.eventually_due.map(
														(item, index) => (
															<li key={index}>
																{item
																	.split('.')
																	.pop()
																	.replace(
																		/_/g,
																		' '
																	)}
															</li>
														)
													)}
												</ul>
											</div>
										)}
									</div>
								</div>
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
