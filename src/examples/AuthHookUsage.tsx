/**
 * Example usage of the useAuth hook with TanStack Query
 * 
 * This file demonstrates various ways to use the auth hook
 * with automatic refetching, error handling, and loading states.
 */

import { useAuth } from '@/hooks/authHook';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

// Example 1: Display logged-in user info with loading and error states
export const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error, refetch, isRefetching } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading user...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load user: {error.message}
          <Button onClick={() => refetch()} variant="outline" size="sm" className="ml-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAuthenticated || !user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
      </div>
      <Button 
        onClick={() => refetch()} 
        variant="ghost" 
        size="icon"
        disabled={isRefetching}
      >
        <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

// Example 2: Login form handler
export const LoginForm = () => {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      // Navigate to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

// Example 3: Logout button
export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} variant="outline">
      Logout
    </Button>
  );
};

// Example 4: Protected content based on role
export const AdminOnlySection = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Or show "Access Denied" message
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>This content is only visible to administrators</p>
    </div>
  );
};

// Example 5: Update user profile
export const UpdateProfileButton = () => {
  const { user, updateUser } = useAuth();

  const handleUpdateName = () => {
    if (user) {
      updateUser({ name: 'New Name' });
    }
  };

  return (
    <Button onClick={handleUpdateName}>
      Update Name
    </Button>
  );
};

// Example 6: Check authentication status
export const AuthStatusIndicator = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}</span>
    </div>
  );
};
