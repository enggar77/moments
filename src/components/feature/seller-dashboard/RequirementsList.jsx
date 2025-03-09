import React from 'react';

export default function RequirementsList({ requirements }) {
	return (
		<div className="mt-4">
			<h3 className="text-sm font-medium text-gray-500 mb-2">
				Required Information
			</h3>
			<div className="bg-gray-50 rounded-lg p-4 space-y-2">
				{requirements.currently_due.length > 0 && (
					<div>
						<h4 className="text-xs font-medium text-red-500">
							Currently Due:
						</h4>
						<ul className="text-sm text-gray-600 list-disc pl-5">
							{requirements.currently_due.map((item, index) => (
								<li key={index}>
									{item.split('.').pop().replace(/_/g, ' ')}
								</li>
							))}
						</ul>
					</div>
				)}

				{requirements.eventually_due.length > 0 && (
					<div>
						<h4 className="text-xs font-medium text-orange-500">
							Eventually Due:
						</h4>
						<ul className="text-sm text-gray-600 list-disc pl-5">
							{requirements.eventually_due.map((item, index) => (
								<li key={index}>
									{item.split('.').pop().replace(/_/g, ' ')}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}