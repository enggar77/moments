import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { ClerkProvider } from '@clerk/clerk-react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthProvider } from './context/AuthContext.jsx';
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ClerkProvider
			publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
		>
			<ConvexProvider client={convex}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</ConvexProvider>
		</ClerkProvider>
	</StrictMode>
);
