import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: '',

		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/ticket/:userId',
				element: <div>My Tickets</div>,
			},
			{
				path: '/sell',
				element: <div>Sell Tickets</div>,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,

				children: [
					{
						path: '/dashboard/events',
						element: <div>All Events</div>,
					},
					{
						path: '/dashboard/users',
						element: <div>All Users</div>,
					},
				],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
