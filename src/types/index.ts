// Types for the appointment management system

export type StaffType = 'Doctor' | 'Consultant' | 'Support Agent';

export type AvailabilityStatus = 'Available' | 'On Leave';

export type ServiceDuration = 15 | 30 | 60;

export type AppointmentStatus = 'Waiting' | 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
export interface Staff {
  id: string;
  name: string;
  serviceType: StaffType;
  dailyCapacity: number;
  availabilityStatus: AvailabilityStatus;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: ServiceDuration;
  requiredStaffType: StaffType;
  description?: string;
}

export interface Appointment {
  id?: string;
  customerName: string;
  service: string;
  staff: string | null;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; 
  queuePosition?: number | null;
  status: AppointmentStatus;
  createdAt?: string;
}

export interface QueueItem {
  id: string;
  appointmentId: string;
  position: number;
  addedAt: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'assignment' | 'queue' | 'status' | 'conflict';
}

export interface DashboardStats {
  totalAppointmentsToday: number;
  completed: number;
  pending: number;
  waitingQueueCount: number;
}

export interface User {
  id: string;
  email: string;
  password?: string

}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refetch: () => void;
  isRefetching: boolean;
}
