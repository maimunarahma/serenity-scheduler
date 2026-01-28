import { Staff, Service, Appointment, QueueItem, ActivityLog } from '@/types';

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Dr. Riya Sharma',
    serviceType: 'Doctor',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  },
  {
    id: '2',
    name: 'Farhan Ahmed',
    serviceType: 'Consultant',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  },
  {
    id: '3',
    name: 'Priya Patel',
    serviceType: 'Support Agent',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  },
  {
    id: '4',
    name: 'Dr. Arjun Mehta',
    serviceType: 'Doctor',
    dailyCapacity: 5,
    availabilityStatus: 'On Leave',
  },
  {
    id: '5',
    name: 'Sara Khan',
    serviceType: 'Consultant',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  },
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'General Consultation',
    duration: 30,
    requiredStaffType: 'Doctor',
    description: 'General health check-up and consultation',
  },
  {
    id: '2',
    name: 'Specialist Check-up',
    duration: 60,
    requiredStaffType: 'Doctor',
    description: 'Detailed examination with specialist',
  },
  {
    id: '3',
    name: 'Financial Consultation',
    duration: 30,
    requiredStaffType: 'Consultant',
    description: 'Financial planning and advice session',
  },
  {
    id: '4',
    name: 'Quick Support',
    duration: 15,
    requiredStaffType: 'Support Agent',
    description: 'Quick issue resolution',
  },
  {
    id: '5',
    name: 'Technical Consultation',
    duration: 60,
    requiredStaffType: 'Consultant',
    description: 'In-depth technical advisory session',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'John Doe',
    serviceId: '1',
    assignedStaffId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'Completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    serviceId: '1',
    assignedStaffId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    serviceId: '3',
    assignedStaffId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    customerName: 'Emily Brown',
    serviceId: '2',
    assignedStaffId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    customerName: 'David Wilson',
    serviceId: '3',
    assignedStaffId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    customerName: 'Sarah Davis',
    serviceId: '4',
    assignedStaffId: '3',
    date: new Date().toISOString().split('T')[0],
    time: '11:30',
    status: 'Cancelled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    customerName: 'Chris Lee',
    serviceId: '1',
    assignedStaffId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    customerName: 'Amanda Taylor',
    serviceId: '3',
    assignedStaffId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    customerName: 'Robert Martinez',
    serviceId: '5',
    assignedStaffId: '5',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    customerName: 'Lisa Anderson',
    serviceId: '3',
    assignedStaffId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '15:30',
    status: 'No-Show',
    createdAt: new Date().toISOString(),
  },
];

export const mockQueueItems: QueueItem[] = [
  {
    id: 'q1',
    appointmentId: 'q-apt-1',
    position: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'q2',
    appointmentId: 'q-apt-2',
    position: 2,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'q3',
    appointmentId: 'q-apt-3',
    position: 3,
    addedAt: new Date().toISOString(),
  },
];

export const mockQueueAppointments: Appointment[] = [
  {
    id: 'q-apt-1',
    customerName: 'Thomas White',
    serviceId: '1',
    assignedStaffId: null,
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-apt-2',
    customerName: 'Jennifer Green',
    serviceId: '2',
    assignedStaffId: null,
    date: new Date().toISOString().split('T')[0],
    time: '11:30',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-apt-3',
    customerName: 'Kevin Brown',
    serviceId: '1',
    assignedStaffId: null,
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    message: 'Appointment for "John Doe" marked as completed by Dr. Riya Sharma.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'status',
  },
  {
    id: '2',
    message: 'Appointment for "Jane Smith" auto-assigned to Dr. Riya Sharma.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'assignment',
  },
  {
    id: '3',
    message: 'Appointment moved from queue to Farhan Ahmed.',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    type: 'queue',
  },
  {
    id: '4',
    message: 'Time conflict detected for Dr. Arjun Mehta at 10:00 AM.',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    type: 'conflict',
  },
  {
    id: '5',
    message: 'New appointment for "Emily Brown" created.',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    type: 'assignment',
  },
  {
    id: '6',
    message: 'Appointment for "Sarah Davis" cancelled.',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    type: 'status',
  },
  {
    id: '7',
    message: 'Dr. Arjun Mehta marked as "On Leave".',
    timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
    type: 'status',
  },
];

// Helper function to get appointments for a specific staff member today
export const getStaffAppointmentsToday = (staffId: string): Appointment[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockAppointments.filter(
    (apt) => apt.assignedStaffId === staffId && apt.date === today && apt.status !== 'Cancelled'
  );
};

// Helper function to get staff load
export const getStaffLoad = (staffId: string): { current: number; max: number } => {
  const staff = mockStaff.find((s) => s.id === staffId);
  const appointments = getStaffAppointmentsToday(staffId);
  return {
    current: appointments.length,
    max: staff?.dailyCapacity || 5,
  };
};
