/**
 * Example usage of the useAppointments hook with TanStack Query
 * 
 * This demonstrates how to use the AppointmentContext globally
 * with automatic refetching, caching, and error handling
 */

import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';

// Example 1: Basic usage with loading and error states
export const AppointmentsListExample = () => {
  const { 
    appointments, 
    isLoading, 
    error, 
    refetch, 
    isRefetching 
  } = useAppointments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments ({appointments.length})</h2>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          disabled={isRefetching}
        >
          {isRefetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {appointments.map((apt) => (
        <Card key={apt.id}>
          <CardHeader>
            <CardTitle>{apt.customerName}</CardTitle>
            <CardDescription>
              {apt.date} at {apt.startTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>{apt.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Example 2: Create appointment with optimistic updates
export const CreateAppointmentForm = () => {
  const { createAppointment, isLoading } = useAppointments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    await createAppointment({
      customerName: formData.get('customerName') as string,
      service: formData.get('service') as string,
      staff: formData.get('staff') as string,
      date: formData.get('date') as string,
      status: 'Scheduled',
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="customerName" placeholder="Customer Name" required />
      <input name="service" placeholder="Service" required />
      <input name="staff" placeholder="Staff" required />
      <input name="staffId" placeholder="Staff ID" required />
      <input name="date" type="date" required />
      <input name="startTime" type="time" required />
      <input name="endTime" type="time" required />
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Appointment'}
      </Button>
    </form>
  );
};

// Example 3: Update appointment status with mutations
export const AppointmentActions = ({ appointmentId }: { appointmentId: string }) => {
  const { 
    completeAppointment, 
    cancelAppointment, 
    markAsNoShow,
    getAppointmentById 
  } = useAppointments();

  const appointment = getAppointmentById(appointmentId);

  if (!appointment) return null;

  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => completeAppointment(appointmentId)}
        disabled={appointment.status === 'Completed'}
      >
        Complete
      </Button>
      <Button 
        onClick={() => cancelAppointment(appointmentId)}
        variant="outline"
        disabled={appointment.status === 'Cancelled'}
      >
        Cancel
      </Button>
      <Button 
        onClick={() => markAsNoShow(appointmentId)}
        variant="destructive"
        disabled={appointment.status === 'No-Show'}
      >
        No-Show
      </Button>
    </div>
  );
};

// Example 4: Filter appointments by date with real-time updates
export const TodaysAppointments = () => {
  const { getAppointmentsByDate, isLoading } = useAppointments();
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = getAppointmentsByDate(today);

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
        <CardDescription>{todaysAppointments.length} appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {todaysAppointments.map((apt) => (
            <li key={apt.id} className="flex justify-between items-center">
              <span>{apt.time} - {apt.customerName}</span>
              <Badge>{apt.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Example 5: Delete appointment with confirmation
export const DeleteAppointmentButton = ({ appointmentId }: { appointmentId: string }) => {
  const { deleteAppointment, getAppointmentById } = useAppointments();
  const appointment = getAppointmentById(appointmentId);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(appointmentId);
    }
  };

  if (!appointment) return null;

  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete
    </Button>
  );
};

// Example 6: Filter by status with counts
export const AppointmentStatusSummary = () => {
  const { getAppointmentsByStatus, isLoading } = useAppointments();

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  const scheduled = getAppointmentsByStatus('Scheduled');
  const completed = getAppointmentsByStatus('Completed');
  const cancelled = getAppointmentsByStatus('Cancelled');
  const noShow = getAppointmentsByStatus('No-Show');

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{scheduled.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{completed.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{cancelled.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>No-Show</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{noShow.length}</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Example 7: Staff appointments view
export const StaffAppointmentsView = ({ staffId }: { staffId: string }) => {
  const { getAppointmentsByStaff, isLoading } = useAppointments();
  const staffAppointments = getAppointmentsByStaff(staffId);

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Appointments</CardTitle>
        <CardDescription>{staffAppointments.length} total</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {staffAppointments.map((apt) => (
            <li key={apt.id} className="flex justify-between">
              <span>{apt.customerName} - {apt.date} {apt.time}</span>
              <Badge>{apt.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Example 8: Update appointment with form
export const EditAppointmentForm = ({ appointmentId }: { appointmentId: string }) => {
  const { updateAppointment, getAppointmentById } = useAppointments();
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) return <div>Appointment not found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    await updateAppointment(appointmentId, {
      customerName: formData.get('customerName') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        name="customerName" 
        defaultValue={appointment.customerName} 
        placeholder="Customer Name" 
      />
      <input 
        name="date" 
        type="date" 
        defaultValue={appointment.date} 
      />
      <input 
        name="time" 
        type="time" 
        defaultValue={appointment.time} 
      />
      <Button type="submit">Update Appointment</Button>
    </form>
  );
};

// Example 9: Auto-refetching indicator
export const RefetchIndicator = () => {
  const { isRefetching } = useAppointments();

  if (!isRefetching) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 flex items-center">
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      <span className="text-sm">Syncing appointments...</span>
    </div>
  );
};
