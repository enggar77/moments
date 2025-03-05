import { createContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
	const { user } = useUser();
	const createUser = useMutation(api.users.createUser);

	useEffect(() => {
		const syncUser = async () => {
			if (!user || !user.id) return;

			if (user) {
				try {
					// Create user in Convex database
					await createUser({
						userId: user.id,
						email: user.primaryEmailAddress?.emailAddress,
						name: user.fullName,
					});
				} catch (error) {
					console.error('Error creating user:', error);
				}
			}
		};

		syncUser();
	}, [user, createUser]);

	return <AuthContext.Provider value={''}>{children}</AuthContext.Provider>;
};
