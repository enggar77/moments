import React from 'react';

export default function AccountStatusSection({ accountStatus }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* Account Status Card */}
			<div className="bg-gray-50 rounded-lg p-4">
				<h3 className="text-sm font-medium text-gray-500">Account Status</h3>
				<div className="mt-2 flex items-center">
					<div
						className={`w-3 h-3 rounded-full mr-2 ${accountStatus.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}
					/>
					<span className="text-lg font-semibold">
						{accountStatus.isActive ? 'Active' : 'Pending Setup'}
					</span>
				</div>
			</div>

			{/* Payments Status Card */}
			<div className="bg-gray-50 rounded-lg p-4">
				<h3 className="text-sm font-medium text-gray-500">Payment Capability</h3>
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
	);
}