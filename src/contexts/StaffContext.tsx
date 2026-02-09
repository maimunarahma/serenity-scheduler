import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Staff, StaffType, AvailabilityStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface CreateStaffData {
  name: string;
  serviceType: StaffType;
  dailyCapacity: number;
  avatar?: string;
}

interface UpdateStaffData {
  name?: string;
  serviceType?: StaffType;
  dailyCapacity?: number;
  availabilityStatus?: AvailabilityStatus;
  avatar?: string;
}

interface StaffContextType {
  // Query state
  staff: Staff[];
  isLoading: boolean;
  error: Error | null;
  
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isSaving: boolean; // Combined loading state
  
  // CRUD Operations
  createStaff: (data: CreateStaffData) => Promise<Staff | null>;
  updateStaff: (id: string, data: UpdateStaffData) => Promise<Staff | null>;
  deleteStaff: (id: string) => Promise<boolean>;
  
  // Query Methods
  getStaffById: (id: string) => Staff | undefined;
  getStaffByType: (serviceType: StaffType) => Staff[];
  getAvailableStaff: () => Staff[];
  getAvailableStaffByType: (serviceType: StaffType) => Staff[];
  
  // Availability Methods
  setAvailabilityStatus: (id: string, status: AvailabilityStatus) => Promise<boolean>;
  markAsAvailable: (id: string) => Promise<boolean>;
  markAsOnLeave: (id: string) => Promise<boolean>;
  
  // Capacity Management
  updateCapacity: (id: string, capacity: number) => Promise<boolean>;
  
  // Statistics
  getStaffStats: () => {
    total: number;
    available: number;
    onLeave: number;
    byType: {
      doctors: number;
      consultants: number;
      supportAgents: number;
    };
  };
  
  // Utility
  refetch: () => void;
  isRefetching: boolean;
}

export const StaffContext = createContext<StaffContextType | undefined>(undefined);

interface StaffProviderProps {
  children: ReactNode;
}

// API functions
const fetchStaff = async (): Promise<Staff[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/staff`, {
    withCredentials: true,
  });
  return data;
};

const createStaffAPI = async (staffData: CreateStaffData): Promise<Staff> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/staff`,
    staffData,
    { withCredentials: true }
  );
  return data;
};

const updateStaffAPI = async ({
  id,
  updates,
}: {
  id: string;
  updates: UpdateStaffData;
}): Promise<Staff> => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_SERVER_URL}/staff/${id}`,
    updates,
    { withCredentials: true }
  );
  return data;
};

const deleteStaffAPI = async (id: string): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_SERVER_URL}/staff/${id}`, {
    withCredentials: true,
  });
};

export const StaffProvider = ({ children }: StaffProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff with TanStack Query
  const {
    data: staff = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Staff[], Error>({
    queryKey: ['staff'],
    queryFn: fetchStaff,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createStaffAPI,
    onSuccess: (newStaff) => {
      queryClient.setQueryData<Staff[]>(['staff'], (old = []) => [
        ...old,
        newStaff,
      ]);
      toast({
        title: 'Staff Member Added',
        description: `${newStaff.name} has been added to the team.`,
      });
    },
    onError: (error) => {
      console.error('Failed to create staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to add staff member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateStaffAPI,
    onSuccess: (updatedStaff) => {
      queryClient.setQueryData<Staff[]>(['staff'], (old = []) =>
        old.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
      );
      toast({
        title: 'Staff Member Updated',
        description: 'Staff member has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteStaffAPI,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Staff[]>(['staff'], (old = []) =>
        old.filter((s) => s.id !== deletedId)
      );
      toast({
        title: 'Staff Member Removed',
        description: 'Staff member has been successfully removed.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove staff member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // CRUD Operations
  const createStaff = async (data: CreateStaffData): Promise<Staff | null> => {
    try {
      const result = await createMutation.mutateAsync(data);
      return result;
    } catch (error) {
      return null;
    }
  };

  const updateStaff = async (
    id: string,
    updates: UpdateStaffData
  ): Promise<Staff | null> => {
    try {
      const result = await updateMutation.mutateAsync({ id, updates });
      return result;
    } catch (error) {
      return null;
    }
  };

  const deleteStaff = async (id: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Query Methods
  const getStaffById = (id: string): Staff | undefined => {
    return staff.find((s) => s.id === id);
  };

  const getStaffByType = (serviceType: StaffType): Staff[] => {
    return staff.filter((s) => s.serviceType === serviceType);
  };

  const getAvailableStaff = (): Staff[] => {
    return staff.filter((s) => s.status === 'Available');
  };

  const getAvailableStaffByType = (serviceType: StaffType): Staff[] => {
    return staff.filter(
      (s) => s.serviceType === serviceType && s.status === 'Available'
    );
  };

  // Availability Methods
  const setAvailabilityStatus = async (
    id: string,
    status: AvailabilityStatus
  ): Promise<boolean> => {
    const result = await updateStaff(id, { availabilityStatus: status });
    return result !== null;
  };

  const markAsAvailable = async (id: string): Promise<boolean> => {
    return setAvailabilityStatus(id, 'Available');
  };

  const markAsOnLeave = async (id: string): Promise<boolean> => {
    return setAvailabilityStatus(id, 'On Leave');
  };

  // Capacity Management
  const updateCapacity = async (id: string, capacity: number): Promise<boolean> => {
    if (capacity < 0) {
      toast({
        title: 'Invalid Capacity',
        description: 'Capacity cannot be negative.',
        variant: 'destructive',
      });
      return false;
    }

    const result = await updateStaff(id, { dailyCapacity: capacity });
    return result !== null;
  };

  // Statistics
  const getStaffStats = () => {
    return {
      total: staff.length,
      available: staff.filter((s) => s.status === 'Available').length,
      onLeave: staff.filter((s) => s.status === 'On Leave').length,
      byType: {
        doctors: staff.filter((s) => s.serviceType === 'Doctor').length,
        consultants: staff.filter((s) => s.serviceType === 'Consultant').length,
        supportAgents: staff.filter((s) => s.serviceType === 'Support Agent').length,
      },
    };
  };

  const value: StaffContextType = {
    // Query state
    staff,
    isLoading,
    error,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    
    // CRUD Operations
    createStaff,
    updateStaff,
    deleteStaff,
    
    // Query Methods
    getStaffById,
    getStaffByType,
    getAvailableStaff,
    getAvailableStaffByType,
    
    // Availability Methods
    setAvailabilityStatus,
    markAsAvailable,
    markAsOnLeave,
    
    // Capacity Management
    updateCapacity,
    
    // Statistics
    getStaffStats,
    
    // Utility
    refetch,
    isRefetching,
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};


 