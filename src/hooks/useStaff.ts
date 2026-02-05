import { useState, useEffect, useCallback } from 'react';
import { Staff, StaffType, AvailabilityStatus } from '@/types';
import { mockStaff } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

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

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load staff from localStorage or use mock data
  useEffect(() => {
    const loadStaff = () => {
      try {
        const storedStaff = localStorage.getItem('staff');
        if (storedStaff) {
          setStaff(JSON.parse(storedStaff));
        } else {
          setStaff(mockStaff);
          localStorage.setItem('staff', JSON.stringify(mockStaff));
        }
      } catch (err) {
        console.error('Failed to load staff:', err);
        setError('Failed to load staff');
        setStaff(mockStaff);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  // Save staff to localStorage whenever they change
  const saveStaff = useCallback((newStaff: Staff[]) => {
    try {
      localStorage.setItem('staff', JSON.stringify(newStaff));
      setStaff(newStaff);
    } catch (err) {
      console.error('Failed to save staff:', err);
      setError('Failed to save staff');
    }
  }, []);

  // Create a new staff member
  const createStaff = useCallback(
    async (data: CreateStaffData): Promise<Staff | null> => {
      try {
        const newStaff: Staff = {
          id: `staff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          availabilityStatus: 'Available',
        };

        const updatedStaff = [...staff, newStaff];
        saveStaff(updatedStaff);

        toast({
          title: 'Staff Member Added',
          description: `${data.name} has been added to the team.`,
        });

        return newStaff;
      } catch (err) {
        console.error('Failed to create staff:', err);
        setError('Failed to create staff');
        toast({
          title: 'Error',
          description: 'Failed to add staff member. Please try again.',
          variant: 'destructive',
        });
        return null;
      }
    },
    [staff, saveStaff, toast]
  );

  // Update an existing staff member
  const updateStaff = useCallback(
    async (id: string, data: UpdateStaffData): Promise<Staff | null> => {
      try {
        const staffIndex = staff.findIndex((s) => s.id === id);
        if (staffIndex === -1) {
          throw new Error('Staff member not found');
        }

        const updatedStaffMember = {
          ...staff[staffIndex],
          ...data,
        };

        const updatedStaff = [...staff];
        updatedStaff[staffIndex] = updatedStaffMember;
        saveStaff(updatedStaff);

        toast({
          title: 'Staff Member Updated',
          description: 'Staff member has been successfully updated.',
        });

        return updatedStaffMember;
      } catch (err) {
        console.error('Failed to update staff:', err);
        setError('Failed to update staff');
        toast({
          title: 'Error',
          description: 'Failed to update staff member. Please try again.',
          variant: 'destructive',
        });
        return null;
      }
    },
    [staff, saveStaff, toast]
  );

  // Delete a staff member
  const deleteStaff = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const updatedStaff = staff.filter((s) => s.id !== id);
        saveStaff(updatedStaff);

        toast({
          title: 'Staff Member Removed',
          description: 'Staff member has been successfully removed.',
        });

        return true;
      } catch (err) {
        console.error('Failed to delete staff:', err);
        setError('Failed to delete staff');
        toast({
          title: 'Error',
          description: 'Failed to remove staff member. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    },
    [staff, saveStaff, toast]
  );

  // Get a single staff member by ID
  const getStaffById = useCallback(
    (id: string): Staff | undefined => {
      return staff.find((s) => s.id === id);
    },
    [staff]
  );

  // Get staff by service type
  const getStaffByType = useCallback(
    (serviceType: StaffType): Staff[] => {
      return staff.filter((s) => s.serviceType === serviceType);
    },
    [staff]
  );

  // Get available staff
  const getAvailableStaff = useCallback((): Staff[] => {
    return staff.filter((s) => s.availabilityStatus === 'Available');
  }, [staff]);

  // Get available staff by type
  const getAvailableStaffByType = useCallback(
    (serviceType: StaffType): Staff[] => {
      return staff.filter(
        (s) => s.serviceType === serviceType && s.availabilityStatus === 'Available'
      );
    },
    [staff]
  );

  // Set staff availability status
  const setAvailabilityStatus = useCallback(
    async (id: string, status: AvailabilityStatus): Promise<boolean> => {
      const result = await updateStaff(id, { availabilityStatus: status });
      return result !== null;
    },
    [updateStaff]
  );

  // Mark staff as available
  const markAsAvailable = useCallback(
    async (id: string): Promise<boolean> => {
      return setAvailabilityStatus(id, 'Available');
    },
    [setAvailabilityStatus]
  );

  // Mark staff as on leave
  const markAsOnLeave = useCallback(
    async (id: string): Promise<boolean> => {
      return setAvailabilityStatus(id, 'On Leave');
    },
    [setAvailabilityStatus]
  );

  // Update staff capacity
  const updateCapacity = useCallback(
    async (id: string, capacity: number): Promise<boolean> => {
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
    },
    [updateStaff, toast]
  );

  // Get staff statistics
  const getStaffStats = useCallback(() => {
    return {
      total: staff.length,
      available: staff.filter((s) => s.availabilityStatus === 'Available').length,
      onLeave: staff.filter((s) => s.availabilityStatus === 'On Leave').length,
      byType: {
        doctors: staff.filter((s) => s.serviceType === 'Doctor').length,
        consultants: staff.filter((s) => s.serviceType === 'Consultant').length,
        supportAgents: staff.filter((s) => s.serviceType === 'Support Agent').length,
      },
    };
  }, [staff]);

  // Refresh staff from storage
  const refreshStaff = useCallback(() => {
    setIsLoading(true);
    try {
      const storedStaff = localStorage.getItem('staff');
      if (storedStaff) {
        setStaff(JSON.parse(storedStaff));
      }
    } catch (err) {
      console.error('Failed to refresh staff:', err);
      setError('Failed to refresh staff');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    staff,
    isLoading,
    error,

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
    refreshStaff,
  };
};
