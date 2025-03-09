const Overview = () => {
	const stats = [
		{
			title: 'Total Users',
			value: '1,200',
			description: '↗︎ 400 (30%)',
			color: 'text-green-600',
		},
		{
			title: 'Tickets Sold',
			value: '3,400',
			description: '↗︎ 900 (40%)',
			color: 'text-green-600',
		},
		{
			title: 'Active Events',
			value: '12',
			description: '↘︎ 2 (10%)',
			color: 'text-red-600',
		},
	];

	return (
		<>
			<div className="p-6 w-full max-w-full">
			    <div className="bg-white p-6 rounded-lg shadow-md">
			        <h2 className="text-2xl font-bold mb-6">Overview</h2>
			        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			        	{stats.map((stat, index) => (
			        		<div
			        			key={index}
			        			className="shadow-lg p-6 rounded-xl bg-white border border-gray-200"
			        		>
			        			<div className="text-gray-600 text-sm font-semibold">
			        				{stat.title}
			        			</div>
			        			<div className="text-3xl font-extrabold my-2">
			        				{stat.value}
			        			</div>
			        			<div className={`${stat.color} text-sm font-medium`}>
			        				{stat.description}
			        			</div>
			        		</div>
			        	))}
			        </div>

			        <div className="mt-8 p-6">
				        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
				        <div className="overflow-x-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
				        	<table className="w-full border-collapse">
				        		<thead>
				        			<tr className="bg-gray-100 text-gray-700 text-left">
				        				<th className="p-3">Date</th>
				        				<th className="p-3">User</th>
				        				<th className="p-3">Action</th>
				        				<th className="p-3">Status</th>
				        			</tr>
				        		</thead>
				        		<tbody className="divide-y divide-gray-200">
				        			<tr className="hover:bg-gray-50">
				        				<td className="p-3">2024-03-04</td>
				        				<td className="p-3">Albus Dumbledore</td>
				        				<td className="p-3">Purchased Ticket</td>
				        				<td className="p-3">
				        					<span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
				        						Completed
				        					</span>
				        				</td>
				        			</tr>
				        			<tr className="hover:bg-gray-50">
				        				<td className="p-3">2024-03-04</td>
				        				<td className="p-3">Tom Riddle</td>
				        				<td className="p-3">Created Event</td>
				        				<td className="p-3">
				        					<span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
				        						Pending
				        					</span>
				        				</td>
				        			</tr>
				        			<tr className="hover:bg-gray-50">
				        				<td className="p-3">2024-03-03</td>
				        				<td className="p-3">Harry Potter</td>
				        				<td className="p-3">Updated Profile</td>
				        				<td className="p-3">
				        					<span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
				        						Completed
				        					</span>
				        				</td>
				        			</tr>
				        		</tbody>
				        	</table>
				        </div>
				    </div>
				</div>
			</div>
		</>
	);
}

export default Overview
