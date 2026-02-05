import { useAppointmentContext } from '@/contexts/AppointmentContext';

/**
 * Custom hook to access appointment data and methods from global context
 * Uses TanStack Query for automatic refetching, caching, and error handling
 * 
 * @returns {Object} Appointment context with data, methods, and loading states
 * 
 * @example
 * const { appointments, createAppointment, isLoading, refetch } = useAppointments();
 * 
 * // Create appointment
 * await createAppointment({ customerName: 'John', ... });
 * 
 * // Get appointments by date
 * const todaysAppointments = getAppointmentsByDate('2026-01-29');
 * 
 * // Manual refetch
 * refetch();
 */
export const useAppointments = () => {
  return useAppointmentContext();
};
