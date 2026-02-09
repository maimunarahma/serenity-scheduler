import { Staff, Service, Appointment } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'General Consultation',
    duration: 30,
  
  },
  {
    id: '2',
    name: 'Specialist Check-up',
    duration: 60,
  
  },
  {
    id: '3',
    name: 'Financial Consultation',
    duration: 30,
  
  },
  {
    id: '4',
    name: 'Quick Support',
    duration: 15,
  },
  {
    id: '5',
    name: 'Technical Consultation',
    duration: 60,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'John Doe',
    service: '1',
    staff: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    queuePosition: null,
    status: 'Completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    service: '1',
    staff: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:30',
    endTime: '10:00',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    service: '3',
    staff: '2',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:30',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    customerName: 'Emily Brown',
    service: '2',
    staff: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '11:30',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  }
];



export const mockQueueAppointments: Appointment[] = [
  {
    id: 'q-apt-1',
    customerName: 'Thomas White',
    service: '1',
    staff: null,
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:30',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-apt-2',
    customerName: 'Jennifer Green',
    service: '2',
    staff: null,
    date: new Date().toISOString().split('T')[0],
    startTime: '11:30',
    endTime: '12:00',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-apt-3',
    customerName: 'Kevin Brown',
    service: '1',
    staff: null,
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '12:30',
    queuePosition: null,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
];

// export const mockActivityLogs: ActivityLog[] = [
//   {
//     id: '1',
//     message: 'Appointment for "John Doe" marked as completed by Dr. Riya Sharma.',
//     timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
//     type: 'status',
//   },
//   {
//     id: '2',
//     message: 'Appointment for "Jane Smith" auto-assigned to Dr. Riya Sharma.',
//     timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
//     type: 'assignment',
//   },
//   {
//     id: '3',
//     message: 'Appointment moved from queue to Farhan Ahmed.',
//     timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
//     type: 'queue',
//   },
//   {
//     id: '4',
//     message: 'Time conflict detected for Dr. Arjun Mehta at 10:00 AM.',
//     timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
//     type: 'conflict',
//   },
//   {
//     id: '5',
//     message: 'New appointment for "Emily Brown" created.',
//     timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
//     type: 'assignment',
//   },
//   {
//     id: '6',
//     message: 'Appointment for "Sarah Davis" cancelled.',
//     timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
//     type: 'status',
//   },
//   {
//     id: '7',
//     message: 'Dr. Arjun Mehta marked as "On Leave".',
//     timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
//     type: 'status',
//   },
// ];

// Helper function to get appointments for a specific staff member today
export const getStaffAppointmentsToday = (staffId: string): Appointment[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockAppointments.filter(
    (apt) => apt.staff === staffId && apt.date === today && apt.status !== 'Cancelled'
  );
};

// Helper function to get staff load
// Note: This will need to be updated to use dynamic staff data
export const getStaffLoad = (
  staffId: string,
  staffList: Staff[]
) => {
  const staff = staffList?.find(s => s._id === staffId);
  return staff?.dailyCapacity || 0;
};
