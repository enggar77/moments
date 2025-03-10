import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import Error from './components/Error';
import EventDetails from './pages/EventDetails';
import TransactionManagement from './pages/admin/TransactionManagement';
import Overview from './pages/admin/Overview';
import EventManagement from './pages/admin/EventManagement';
import UserManagement from './pages/admin/UserManagement';
import Seller from './pages/seller/Seller';
import EventForm from './components/feature/create-event/EventForm';
import EditEvent from './components/feature/create-event/EditEvent';
import SellerEvents from './pages/seller/SellerEvents';
import PurchaseSuccess from './pages/user/PurchaseSuccess';
import MyTickets from './pages/user/MyTickets';
import TicketPage from './pages/user/TicketPage';
import SearchPage from './pages/SearchPage';

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <Error />,

		children: [
			// HOME
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/search',
				element: <SearchPage />,
			},

			//USER TICKET
			{
				path: '/tickets/:id',
				element: <MyTickets />,
			},
			{
				path: '/ticket/:id',
				element: <TicketPage />,
			},
			{
				path: 'ticket/purchase-success',
				element: <PurchaseSuccess />,
			},

			// SELLER / ORGANIZER
			{
				path: '/seller',
				element: <Seller />,
			},
			{
				path: '/connect/return/:accountId',
				element: <Seller />,
			},
			{
				path: '/connect/refresh/:accountId',
				element: <Seller />,
			},
			{
				path: '/seller/create-event',
				element: <EventForm />,
			},
			{
				path: '/seller/my-events',
				element: <SellerEvents />,
			},
			{
				path: '/seller/events/:id/edit',
				element: <EditEvent />,
			},

			// EVENT DETAILS
			{
				path: '/event/:id',
				element: <EventDetails />,
			},

			// ADMIN DASHBOARD
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
