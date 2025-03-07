import React from 'react';

export default function Header() {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
			<h2 className="text-2xl font-bold">Seller Dashboard</h2>
			<p className="text-blue-100 mt-2">
				Manage your seller profile and payment settings
			</p>
		</div>
	);
}