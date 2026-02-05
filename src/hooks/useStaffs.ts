import { useStaffContext } from '@/contexts/StaffContext';

/**
 * Custom hook to access staff data and methods from global context
 * Uses TanStack Query for automatic refetching, caching, and error handling
 * 
 * @returns {Object} Staff context with data, methods, and loading states
 * 
 * @example
 * const { staff, createStaff, isLoading, refetch } = useStaffs();
 * 
 * // Create staff member
 * await createStaff({ name: 'Dr. Smith', serviceType: 'Doctor', dailyCapacity: 8 });
 * 
 * // Get available staff by type
 * const availableDoctors = getAvailableStaffByType('Doctor');
 * 
 * // Manual refetch
 * refetch();
 */
export const useStaffs = () => {
  return useStaffContext();
};
