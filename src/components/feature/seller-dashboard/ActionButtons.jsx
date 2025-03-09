import React from 'react';
import { Cog } from 'lucide-react';

export default function ActionButtons({
	accountStatus,
	onCompleteOnboarding,
	onManageAccount,
	isLinkCreatePending,
}) {
	return (
		<div className="flex flex-col space-y-4">
			{!accountStatus.isActive && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<h3 className="font-medium text-yellow-800">
						Complete your account setup
					</h3>
					<p className="text-sm text-yellow-700 mt-1 mb-3">
						Your Stripe account requires additional information before you can
						accept payments.
					</p>
					<button
						onClick={onCompleteOnboarding}
						disabled={isLinkCreatePending}
						className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
					>
						{isLinkCreatePending ? (
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
					onClick={onManageAccount}
					className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<Cog className="w-5 h-5" />
					Manage Stripe Account
				</button>
			)}
		</div>
	);
}