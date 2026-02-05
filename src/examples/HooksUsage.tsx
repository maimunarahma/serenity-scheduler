// /**
//  * Example usage of the useAppointment and useStaff hooks
//  * 
//  * This file demonstrates various ways to use these hooks
//  * to manage appointments and staff members.
//  */

// import { useAppointment } from '@/hooks/useAppointment';
// import { useStaff } from '@/hooks/useStaff';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// // ============= APPOINTMENT EXAMPLES =============

// // Example 1: Create an appointment
// export const CreateAppointmentExample = () => {
//   const { createAppointment, isLoading } = useAppointment();

//   const handleCreateAppointment = async () => {
//     await createAppointment({
//       customerName: 'John Doe',
//       serviceId: 'service-1',
//       assignedStaffId: 'staff-1',
//       date: '2026-01-30',
//       time: '10:00',
//     });
//   };

//   return (
//     <Button onClick={handleCreateAppointment} disabled={isLoading}>
//       Create Appointment
//     </Button>
//   );
// };

// // Example 2: List all appointments
// export const AppointmentsList = () => {
//   const { appointments, isLoading, deleteAppointment } = useAppointment();

//   if (isLoading) return <div>Loading appointments...</div>;

//   return (
//     <div className="space-y-2">
//       {appointments.map((appointment) => (
//         <Card key={appointment.id}>
//           <CardHeader>
//             <CardTitle>{appointment.customerName}</CardTitle>
//             <CardDescription>
//               {appointment.date} at {appointment.time}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Badge>{appointment.status}</Badge>
//             <Button 
//               variant="destructive" 
//               size="sm" 
//               onClick={() => deleteAppointment(appointment.id)}
//               className="ml-2"
//             >
//               Delete
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// // Example 3: Update appointment status
// export const UpdateAppointmentStatus = ({ appointmentId }: { appointmentId: string }) => {
//   const { completeAppointment, cancelAppointment, markAsNoShow } = useAppointment();

//   return (
//     <div className="flex gap-2">
//       <Button onClick={() => completeAppointment(appointmentId)} variant="default">
//         Complete
//       </Button>
//       <Button onClick={() => cancelAppointment(appointmentId)} variant="outline">
//         Cancel
//       </Button>
//       <Button onClick={() => markAsNoShow(appointmentId)} variant="destructive">
//         No-Show
//       </Button>
//     </div>
//   );
// };

// // Example 4: Filter appointments by date
// export const TodaysAppointments = () => {
//   const { getAppointmentsByDate } = useAppointment();
//   const today = new Date().toISOString().split('T')[0];
//   const todaysAppointments = getAppointmentsByDate(today);

//   return (
//     <div>
//       <h3>Today's Appointments ({todaysAppointments.length})</h3>
//       <ul>
//         {todaysAppointments.map((apt) => (
//           <li key={apt.id}>
//             {apt.time} - {apt.customerName} - {apt.status}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Example 5: Get appointments by status
// export const ScheduledAppointments = () => {
//   const { getAppointmentsByStatus } = useAppointment();
//   const scheduled = getAppointmentsByStatus('Scheduled');

//   return (
//     <div>
//       <h3>Scheduled Appointments: {scheduled.length}</h3>
//     </div>
//   );
// };

// // ============= STAFF EXAMPLES =============

// // Example 6: Create a staff member
// export const CreateStaffExample = () => {
//   const { createStaff, isLoading } = useStaff();

//   const handleCreateStaff = async () => {
//     await createStaff({
//       name: 'Dr. Sarah Johnson',
//       serviceType: 'Doctor',
//       dailyCapacity: 8,
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
//     });
//   };

//   return (
//     <Button onClick={handleCreateStaff} disabled={isLoading}>
//       Add Staff Member
//     </Button>
//   );
// };

// // Example 7: List all staff
// export const StaffList = () => {
//   const { staff, isLoading, deleteStaff } = useStaff();

//   if (isLoading) return <div>Loading staff...</div>;

//   return (
//     <div className="space-y-2">
//       {staff.map((member) => (
//         <Card key={member.id}>
//           <CardHeader>
//             <CardTitle>{member.name}</CardTitle>
//             <CardDescription>{member.serviceType}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <Badge variant={member.availabilityStatus === 'Available' ? 'default' : 'secondary'}>
//                   {member.availabilityStatus}
//                 </Badge>
//                 <span className="ml-2 text-sm text-muted-foreground">
//                   Capacity: {member.dailyCapacity}
//                 </span>
//               </div>
//               <Button 
//                 variant="destructive" 
//                 size="sm" 
//                 onClick={() => deleteStaff(member.id)}
//               >
//                 Remove
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// // Example 8: Update staff availability
// export const StaffAvailabilityToggle = ({ staffId }: { staffId: string }) => {
//   const { getStaffById, markAsAvailable, markAsOnLeave } = useStaff();
//   const staffMember = getStaffById(staffId);

//   if (!staffMember) return null;

//   const isAvailable = staffMember.availabilityStatus === 'Available';

//   return (
//     <Button
//       onClick={() => isAvailable ? markAsOnLeave(staffId) : markAsAvailable(staffId)}
//       variant={isAvailable ? 'outline' : 'default'}
//     >
//       {isAvailable ? 'Mark as On Leave' : 'Mark as Available'}
//     </Button>
//   );
// };

// // Example 9: Get available staff by type
// export const AvailableDoctors = () => {
//   const { getAvailableStaffByType } = useStaff();
//   const availableDoctors = getAvailableStaffByType('Doctor');

//   return (
//     <div>
//       <h3>Available Doctors: {availableDoctors.length}</h3>
//       <ul>
//         {availableDoctors.map((doctor) => (
//           <li key={doctor.id}>
//             {doctor.name} (Capacity: {doctor.dailyCapacity})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Example 10: Update staff capacity
// export const UpdateStaffCapacity = ({ staffId }: { staffId: string }) => {
//   const { updateCapacity, getStaffById } = useStaff();
//   const staffMember = getStaffById(staffId);

//   const handleIncrease = () => {
//     if (staffMember) {
//       updateCapacity(staffId, staffMember.dailyCapacity + 1);
//     }
//   };

//   const handleDecrease = () => {
//     if (staffMember && staffMember.dailyCapacity > 0) {
//       updateCapacity(staffId, staffMember.dailyCapacity - 1);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <Button onClick={handleDecrease} variant="outline" size="sm">-</Button>
//       <span>{staffMember?.dailyCapacity || 0}</span>
//       <Button onClick={handleIncrease} variant="outline" size="sm">+</Button>
//     </div>
//   );
// };

// // Example 11: Staff statistics
// export const StaffStatistics = () => {
//   const { getStaffStats } = useStaff();
//   const stats = getStaffStats();

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Total Staff</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-bold">{stats.total}</div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Available</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-bold text-green-600">{stats.available}</div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>On Leave</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-bold text-orange-600">{stats.onLeave}</div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Doctors</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-bold">{stats.byType.doctors}</div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// // Example 12: Combined usage - Staff appointments
// export const StaffAppointments = ({ staffId }: { staffId: string }) => {
//   const { getAppointmentsByStaff } = useAppointment();
//   const { getStaffById } = useStaff();
  
//   const staffMember = getStaffById(staffId);
//   const appointments = getAppointmentsByStaff(staffId);

//   if (!staffMember) return <div>Staff member not found</div>;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{staffMember.name}'s Appointments</CardTitle>
//         <CardDescription>{appointments.length} total appointments</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ul className="space-y-2">
//           {appointments.map((apt) => (
//             <li key={apt.id} className="flex justify-between items-center">
//               <span>{apt.customerName} - {apt.date} {apt.time}</span>
//               <Badge>{apt.status}</Badge>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   );
// };

// // Example 13: Update appointment details
// export const EditAppointmentForm = ({ appointmentId }: { appointmentId: string }) => {
//   const { updateAppointment, getAppointmentById } = useAppointment();
//   const appointment = getAppointmentById(appointmentId);

//   const handleUpdate = async () => {
//     await updateAppointment(appointmentId, {
//       customerName: 'Updated Name',
//       time: '14:00',
//     });
//   };

//   if (!appointment) return null;

//   return (
//     <div>
//       <h3>Edit Appointment</h3>
//       <p>Current: {appointment.customerName} at {appointment.time}</p>
//       <Button onClick={handleUpdate}>Update Appointment</Button>
//     </div>
//   );
// };

// // Example 14: Update staff details
// export const EditStaffForm = ({ staffId }: { staffId: string }) => {
//   const { updateStaff, getStaffById } = useStaff();
//   const staffMember = getStaffById(staffId);

//   const handleUpdate = async () => {
//     await updateStaff(staffId, {
//       name: 'Dr. Updated Name',
//       dailyCapacity: 10,
//     });
//   };

//   if (!staffMember) return null;

//   return (
//     <div>
//       <h3>Edit Staff Member</h3>
//       <p>Current: {staffMember.name}</p>
//       <Button onClick={handleUpdate}>Update Staff</Button>
//     </div>
//   );
// };
