# Global State Management with TanStack Query

This project uses **React Context** + **TanStack Query** for powerful global state management with automatic refetching, caching, and error handling.

## 📦 Available Contexts

### 1. **AppointmentContext** - Manage appointments globally
### 2. **StaffContext** - Manage staff members globally
### 3. **AuthContext** - User authentication

---

## 🚀 Quick Start

### Using Appointments

```tsx
import { useAppointments } from '@/hooks/useAppointments';

function MyComponent() {
  const { 
    appointments,      // All appointments
    isLoading,         // Loading state
    error,             // Error state
    createAppointment, // Create new appointment
    updateAppointment, // Update appointment
    deleteAppointment, // Delete appointment
    refetch,           // Manual refetch
    isRefetching       // Refetching indicator
  } = useAppointments();

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;

  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  // Create appointment
  const handleCreate = async () => {
    await createAppointment({
      customerName: 'John Doe',
      service: 'service-id',
      staff: 'staff-id',
      assignedStaffId: 'staff-id',
      date: '2026-01-30',
      status: 'Scheduled',
      startTime: '10:00',
      endTime: '11:00',
    });
  };

  return (
    <div>
      {appointments.map(apt => (
        <div key={apt.id}>{apt.customerName}</div>
      ))}
    </div>
  );
}
```

### Using Staff

```tsx
import { useStaffs } from '@/hooks/useStaffs';

function StaffComponent() {
  const { 
    staff,              // All staff members
    isLoading,          // Loading state
    error,              // Error state
    createStaff,        // Create new staff
    updateStaff,        // Update staff
    deleteStaff,        // Delete staff
    getAvailableStaff,  // Get available staff
    refetch             // Manual refetch
  } = useStaffs();

  // Create staff member
  const handleCreate = async () => {
    await createStaff({
      name: 'Dr. Smith',
      serviceType: 'Doctor',
      dailyCapacity: 8,
    });
  };

  return (
    <div>
      {staff.map(member => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
```

---

## ✨ Features

### 🔄 Automatic Refetching
- **Window Focus**: Automatically refetches when you switch back to the tab
- **Stale Time**: Data is considered fresh for 30 seconds
- **Manual Refetch**: Call `refetch()` anytime

### 📦 Optimistic Updates
- UI updates immediately
- Reverts automatically if the API call fails
- Smooth user experience

### ⚡ Smart Caching
- Data is cached and reused across components
- Reduces unnecessary API calls
- Improves performance

### 🚨 Error Handling
- Automatic error states
- Toast notifications for user feedback
- Retry logic built-in

### 🔔 Loading States
- `isLoading` - Initial data fetch
- `isRefetching` - Background refetch
- Granular control over UI states

---

## 📚 Available Methods

### AppointmentContext Methods

```tsx
// CRUD Operations
createAppointment(data)      // Create new appointment
updateAppointment(id, data)  // Update existing appointment
deleteAppointment(id)        // Delete appointment

// Query Methods
getAppointmentById(id)              // Get single appointment
getAppointmentsByDate(date)         // Filter by date
getAppointmentsByStaff(staffId)     // Filter by staff
getAppointmentsByStatus(status)     // Filter by status

// Status Methods
cancelAppointment(id)        // Mark as cancelled
completeAppointment(id)      // Mark as completed
markAsNoShow(id)             // Mark as no-show

// Utility
refetch()                    // Manual data refresh
```

### StaffContext Methods

```tsx
// CRUD Operations
createStaff(data)            // Create new staff member
updateStaff(id, data)        // Update staff member
deleteStaff(id)              // Delete staff member

// Query Methods
getStaffById(id)                    // Get single staff member
getStaffByType(type)                // Filter by service type
getAvailableStaff()                 // Get all available staff
getAvailableStaffByType(type)       // Get available staff by type

// Availability Methods
setAvailabilityStatus(id, status)   // Set availability
markAsAvailable(id)                 // Mark as available
markAsOnLeave(id)                   // Mark as on leave

// Capacity Management
updateCapacity(id, capacity)        // Update daily capacity

// Statistics
getStaffStats()              // Get staff statistics

// Utility
refetch()                    // Manual data refresh
```

---

## 🎯 Advanced Usage

### Conditional Rendering

```tsx
const { appointments, isLoading, error } = useAppointments();

if (isLoading) {
  return <Spinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <AppointmentList appointments={appointments} />;
```

### Manual Refetch with Indicator

```tsx
const { refetch, isRefetching } = useAppointments();

return (
  <Button onClick={() => refetch()} disabled={isRefetching}>
    {isRefetching ? 'Refreshing...' : 'Refresh'}
  </Button>
);
```

### Filter and Display

```tsx
const { getAppointmentsByDate } = useAppointments();
const today = new Date().toISOString().split('T')[0];
const todaysAppointments = getAppointmentsByDate(today);

return (
  <div>
    <h2>Today's Appointments: {todaysAppointments.length}</h2>
    {todaysAppointments.map(apt => (
      <AppointmentCard key={apt.id} appointment={apt} />
    ))}
  </div>
);
```

### Status Updates

```tsx
const { completeAppointment, cancelAppointment } = useAppointments();

const handleComplete = async (id: string) => {
  const success = await completeAppointment(id);
  if (success) {
    console.log('Appointment completed!');
  }
};
```

---

## 🔧 Configuration

### TanStack Query Settings (in App.tsx)

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,  // Refetch on window focus
      retry: 1,                     // Retry failed requests once
      staleTime: 30000,             // 30 seconds
    },
  },
});
```

### Environment Variables

Make sure to set your API URL:

```env
VITE_SERVER_URL=http://localhost:3000
```

---

## 📖 Example Files

Check these files for complete examples:

- `src/examples/AppointmentContextUsage.tsx` - 9 appointment examples
- `src/examples/HooksUsage.tsx` - 14 combined examples
- `src/examples/AuthHookUsage.tsx` - Authentication examples

---

## 🎨 Best Practices

1. **Use the hooks, not the contexts directly**
   ```tsx
   ✅ const { appointments } = useAppointments();
   ❌ const context = useContext(AppointmentContext);
   ```

2. **Handle loading and error states**
   ```tsx
   if (isLoading) return <Loader />;
   if (error) return <Error message={error.message} />;
   ```

3. **Use query methods for filtering**
   ```tsx
   ✅ const scheduled = getAppointmentsByStatus('Scheduled');
   ❌ const scheduled = appointments.filter(a => a.status === 'Scheduled');
   ```

4. **Let TanStack Query handle refetching**
   - Automatic on window focus
   - Automatic on network reconnect
   - Manual with `refetch()` when needed

---

## 🐛 Troubleshooting

### Data not updating?
- Check if `refetch()` is being called
- Verify API endpoints are correct
- Check browser console for errors

### Fast Refresh warning?
- This is a warning, not an error
- Hooks are properly separated in `/hooks` folder
- App will work correctly despite the warning

### "must be used within Provider" error?
- Ensure `AppointmentProvider` and `StaffProvider` are in `App.tsx`
- Check component hierarchy

---

## 🚀 Next Steps

1. Implement real API endpoints
2. Add authentication to API calls
3. Customize TanStack Query settings
4. Add more specialized query methods
5. Implement pagination for large datasets

Happy coding! 🎉
