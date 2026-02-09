import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment, AppointmentStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface CreateAppointmentData {
  customerName: string;
  service: string;
  staff: string;
  date: string;
  status: string;
  startTime: string;
  endTime: string;
  queuePosition?: number;
}

interface UpdateAppointmentData {
  customerName?: string;
  serviceId?: string;
  assignedStaffId?: string | null;
  date?: string;
  time?: string;
  status?: AppointmentStatus;
}

interface AppointmentContextType {
  // Query state
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isSaving: boolean; // Combined loading state
  
  // CRUD Operations
  createAppointment: (data: CreateAppointmentData) => Promise<Appointment | null>;
  updateAppointment: (id: string, data: UpdateAppointmentData) => Promise<Appointment | null>;
  deleteAppointment: (id: string) => Promise<boolean>;
  
  // Query Methods
  getAppointmentById: (id: string) => Appointment | undefined;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByStaff: (staffId: string) => Appointment[];
  getAppointmentsByStatus: (status: AppointmentStatus) => Appointment[];
  
  // Status Methods
  cancelAppointment: (id: string) => Promise<boolean>;
  completeAppointment: (id: string) => Promise<boolean>;
  markAsNoShow: (id: string) => Promise<boolean>;
  
  // Utility
  refetch: () => void;
  isRefetching: boolean;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

interface AppointmentProviderProps {
  children: ReactNode;
}

// API functions
const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/appointment`, {
      withCredentials: true,
    });
    // Ensure data is always an array
    console.log(res.data)
    return Array.isArray(res.data.appoinments) ? res.data.appoinments : [];
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    // Return empty array on error
    return [];
  }
};

const createAppointmentAPI = async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/appointment`,
    appointmentData,
    { withCredentials: true }
  );
  return data;
};

const updateAppointmentAPI = async ({
  id,
  updates,
}: {
  id: string;
  updates: UpdateAppointmentData;
}): Promise<Appointment> => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_SERVER_URL}/appointment/${id}`,
    updates,
    { withCredentials: true }
  );
  return data;
};

const deleteAppointmentAPI = async (id: string): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_SERVER_URL}/appointment/${id}`, {
    withCredentials: true,
  });
};

export const AppointmentProvider = ({ children }: AppointmentProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments with TanStack Query
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAppointmentAPI,
    onSuccess: (newAppointment) => {
      queryClient.setQueryData<Appointment[]>(['appointments'], (old = []) => [
        ...old,
        newAppointment,
      ]);
      toast({
        title: 'Appointment Created',
        description: `Appointment for ${newAppointment.customerName} has been scheduled.`,
      });
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateAppointmentAPI,
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData<Appointment[]>(['appointments'], (old = []) =>
        old.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
      );
      toast({
        title: 'Appointment Updated',
        description: 'Appointment has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAppointmentAPI,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Appointment[]>(['appointments'], (old = []) =>
        old.filter((apt) => apt.id !== deletedId)
      );
      toast({
        title: 'Appointment Deleted',
        description: 'Appointment has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // CRUD Operations
  const createAppointment = async (data: CreateAppointmentData): Promise<Appointment | null> => {
    try {
      const result = await createMutation.mutateAsync(data);
      return result;
    } catch (error) {
      return null;
    }
  };

  const updateAppointment = async (
    id: string,
    updates: UpdateAppointmentData
  ): Promise<Appointment | null> => {
    try {
      const result = await updateMutation.mutateAsync({ id, updates });
      return result;
    } catch (error) {
      return null;
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Query Methods
  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.find((apt) => apt.id === id);
  };

  const getAppointmentsByDate = (date: string): Appointment[] => {
    return appointments.filter((apt) => apt.date === date);
  };

  const getAppointmentsByStaff = (staffId: string): Appointment[] => {
    return appointments.filter((apt) => apt.staff === staffId);
  };

  const getAppointmentsByStatus = (status: AppointmentStatus): Appointment[] => {
    return appointments.filter((apt) => apt.status === status);
  };

  // Status Methods
  const cancelAppointment = async (id: string): Promise<boolean> => {
    const result = await updateAppointment(id, { status: 'Cancelled' });
    return result !== null;
  };

  const completeAppointment = async (id: string): Promise<boolean> => {
    const result = await updateAppointment(id, { status: 'Completed' });
    return result !== null;
  };

  const markAsNoShow = async (id: string): Promise<boolean> => {
    const result = await updateAppointment(id, { status: 'No-Show' });
    return result !== null;
  };

  const value: AppointmentContextType = {
    // Query state
    appointments,
    isLoading,
    error,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    
    // CRUD Operations
    createAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Query Methods
    getAppointmentById,
    getAppointmentsByDate,
    getAppointmentsByStaff,
    getAppointmentsByStatus,
    
    // Status Methods
    cancelAppointment,
    completeAppointment,
    markAsNoShow,
    
    // Utility
    refetch,
    isRefetching,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Prevent Fast Refresh warning by having only the Provider component exported
