import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Error from './components/Error';
import MyTickets from './pages/MyTickets';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <Error />,

		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/ticket/:userId',
				element: <MyTickets />,
			},
			{
				path: '/sell',
				element: <AddEvent />,
			},
			{
				path: '/seller/events/:eventId/edit',
				element: <EditEvent />
			},
			{
				path: '/event/:eventId',
				element: <div>Event Details</div>,
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
