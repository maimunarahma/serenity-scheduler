/**
 * Examples showing how to use loading spinners with contexts
 */

import { useAppointments } from '@/hooks/useAppointments';
import { useStaffs } from '@/hooks/useStaffs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LoadingSpinner, 
  InlineSpinner, 
  PageLoader, 
  CardLoader,
  SavingOverlay 
} from '@/components/ui/loading-spinner';

// Example 1: Page with loading state
export const AppointmentsPageExample = () => {
  const { appointments, isLoading, error } = useAppointments();

  if (isLoading) {
    return <PageLoader text="Loading appointments..." />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Appointments ({appointments.length})</h1>
      {/* Content */}
    </div>
  );
};

// Example 2: Create button with loading state
export const CreateAppointmentButton = () => {
  const { createAppointment, isCreating } = useAppointments();

  const handleCreate = async () => {
    await createAppointment({
      customerName: 'John Doe',
      service: 'service-1',
      staff: 'staff-1',
      date: '2026-01-30',
      status: 'Scheduled',
      startTime: '10:00',
      endTime: '11:00',
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? (
        <>
          <InlineSpinner className="mr-2" />
          Creating...
        </>
      ) : (
        'Create Appointment'
      )}
    </Button>
  );
};

// Example 3: Card with loading overlay while saving
export const EditAppointmentCard = ({ appointmentId }: { appointmentId: string }) => {
  const { updateAppointment, getAppointmentById, isUpdating } = useAppointments();
  const appointment = getAppointmentById(appointmentId);

  const handleUpdate = async () => {
    await updateAppointment(appointmentId, {
      customerName: 'Updated Name',
    });
  };

  if (!appointment) return null;

  return (
    <Card className="relative">
      {isUpdating && <SavingOverlay text="Updating appointment..." />}
      <CardHeader>
        <CardTitle>{appointment.customerName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          Update
        </Button>
      </CardContent>
    </Card>
  );
};

// Example 4: Delete button with loading state
export const DeleteAppointmentButton = ({ id }: { id: string }) => {
  const { deleteAppointment, isDeleting } = useAppointments();

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      await deleteAppointment(id);
    }
  };

  return (
    <Button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      variant="destructive"
      size="sm"
    >
      {isDeleting ? (
        <>
          <InlineSpinner className="mr-2" />
          Deleting...
        </>
      ) : (
        'Delete'
      )}
    </Button>
  );
};

// Example 5: Form with combined saving state
export const AppointmentForm = () => {
  const { createAppointment, isSaving } = useAppointments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form logic
    await createAppointment({
      customerName: 'John',
      service: 'service-1',
      staff: 'staff-1',
      date: '2026-01-30',
      status: 'Scheduled',
      startTime: '10:00',
      endTime: '11:00',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      {isSaving && <SavingOverlay />}
      
      <input type="text" placeholder="Customer Name" required />
      
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <>
            <InlineSpinner className="mr-2" />
            Saving...
          </>
        ) : (
          'Save Appointment'
        )}
      </Button>
    </form>
  );
};

// Example 6: Staff list with loading
export const StaffListExample = () => {
  const { staff, isLoading, error } = useStaffs();

  if (isLoading) {
    return <CardLoader text="Loading staff members..." />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-2">
      {staff.map((member) => (
        <Card key={member.id}>
          <CardContent className="p-4">
            <h3>{member.name}</h3>
            <p>{member.serviceType}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Example 7: Create staff with loading
export const CreateStaffButton = () => {
  const { createStaff, isCreating } = useStaffs();

  const handleCreate = async () => {
    await createStaff({
      name: 'Dr. Smith',
      serviceType: 'Doctor',
      dailyCapacity: 8,
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      {isCreating && <InlineSpinner className="mr-2" />}
      {isCreating ? 'Adding...' : 'Add Staff'}
    </Button>
  );
};

// Example 8: Multiple actions with different loading states
export const AppointmentActions = ({ id }: { id: string }) => {
  const { 
    completeAppointment, 
    cancelAppointment, 
    deleteAppointment,
    isUpdating,
    isDeleting 
  } = useAppointments();

  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => completeAppointment(id)} 
        disabled={isUpdating}
        size="sm"
      >
        {isUpdating ? <InlineSpinner className="mr-1" /> : null}
        Complete
      </Button>
      
      <Button 
        onClick={() => cancelAppointment(id)} 
        disabled={isUpdating}
        variant="outline"
        size="sm"
      >
        {isUpdating ? <InlineSpinner className="mr-1" /> : null}
        Cancel
      </Button>
      
      <Button 
        onClick={() => deleteAppointment(id)} 
        disabled={isDeleting}
        variant="destructive"
        size="sm"
      >
        {isDeleting ? <InlineSpinner className="mr-1" /> : null}
        Delete
      </Button>
    </div>
  );
};

// Example 9: Full-screen loading
export const AppointmentsDashboard = () => {
  const { appointments, isLoading } = useAppointments();

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading dashboard..." fullScreen />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{appointments.length} appointments</p>
    </div>
  );
};

// Example 10: Refetching indicator
export const RefetchIndicator = () => {
  const { isRefetching, refetch } = useAppointments();

  return (
    <div className="flex items-center gap-2">
      {isRefetching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <InlineSpinner />
          <span>Syncing...</span>
        </div>
      )}
      <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isRefetching}>
        Refresh
      </Button>
    </div>
  );
};

// Example 11: Combined loading states
export const CombinedLoadingExample = () => {
  const { appointments, isLoading, isSaving, isRefetching } = useAppointments();

  return (
    <Card className="relative">
      {(isLoading || isRefetching) && <CardLoader />}
      {isSaving && <SavingOverlay />}
      
      {!isLoading && (
        <CardContent>
          <h3>Appointments: {appointments.length}</h3>
        </CardContent>
      )}
    </Card>
  );
};
