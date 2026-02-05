import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to access the authenticated user and auth methods
 * Re-exports the useAuth hook from AuthContext for convenience
 * 
 * @returns {Object} Auth context with user, authentication state, and methods
 * @property {User | null} user - The currently logged-in user or null
 * @property {boolean} isAuthenticated - Whether a user is currently authenticated
 * @property {boolean} isLoading - Whether auth state is being loaded
 * @property {Function} login - Function to log in a user
 * @property {Function} logout - Function to log out the current user
 * @property {Function} updateUser - Function to update user data
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (!isAuthenticated) return <LoginPage />;
 * 
 * return <div>Welcome, {user.name}!</div>;
 */
export { useAuth };
