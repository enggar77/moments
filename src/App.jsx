import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Error from './components/Error';
// import MyTickets from './pages/MyTickets';
// import AddEvent from './pages/AddEvent';
// import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import TransactionManagement from './pages/TransactionManagement';
import Overview from './pages/Overview';
import EventManagement from './pages/admin/EventManagement';
import UserManagement from './pages/admin/UserManagement';
import Seller from './pages/Seller';

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
				path: '/ticket/:id',
				element: <div>my tickets</div>,
			},
			{
				path: '/seller',
				element: <Seller />,
			},
			{
				path: '/seller/events/:eventId/edit',
				element: <div>edit</div>,
			},
			{
				path: '/event/:id',
				element: <EventDetails />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,

				children: [
					{
						path: '/dashboard',
						element: <Overview />,
					},
					{
						path: '/dashboard/events',
						element: <EventManagement />,
					},
					{
						path: '/dashboard/users',
						element: <UserManagement />,
					},
					{
						path: '/dashboard/transactions',
						element: <TransactionManagement />,
					},
				],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
