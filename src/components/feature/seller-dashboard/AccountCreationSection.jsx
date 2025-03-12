import React from 'react';

export default function AccountCreationSection({ onCreateAccount, isLoading }) {
	return (
		<div className="text-center py-8">
			<h3 className="text-xl font-semibold mb-4">Start Accepting Payments</h3>
			<p className="text-gray-600 mb-6">
				Create your seller account to start receiving payments securely through
				Stripe
			</p>
			<button
				onClick={onCreateAccount}
				disabled={isLoading}
				className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
			>
				{isLoading ? (
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
					'Create Seller Account'
				)}
			</button>
		</div>
	);
}