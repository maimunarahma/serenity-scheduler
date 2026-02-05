import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, AuthContextType } from '@/types';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// API functions
const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    // If not authenticated, return null
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  // Fetch current user with TanStack Query
  const {
    data: user = null,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<User | null, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: false, // Don't retry if not authenticated
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        { email, password },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const register = async (email: string, password: string): Promise<void> => {
    await registerMutation.mutateAsync({ email, password });
  };
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        { email, password },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      queryClient.setQueryData(['currentUser'], null);
    },
  });

  const login = async (email: string, password: string): Promise<void> => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    queryClient.setQueryData(['currentUser'], updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    updateUser,
    refetch,
    isRefetching,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Prevent Fast Refresh warning by having only the Provider component exported
