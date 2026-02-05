# Loading Spinner Implementation Guide

## Overview
Comprehensive loading spinner system integrated with TanStack Query contexts for all CRUD operations.

---

## Components

### LoadingSpinner
Main spinner component with customizable size and text.

```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

<LoadingSpinner size="md" text="Loading..." />
<LoadingSpinner size="lg" text="Please wait" fullScreen />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `text`: Optional loading message
- `fullScreen`: Boolean for full-screen overlay
- `className`: Additional CSS classes

### InlineSpinner
Small spinner for buttons and inline elements.

```tsx
import { InlineSpinner } from '@/components/ui/loading-spinner';

<Button disabled={isLoading}>
  {isLoading && <InlineSpinner className="mr-2" />}
  Save
</Button>
```

### PageLoader
Full-page loading state.

```tsx
import { PageLoader } from '@/components/ui/loading-spinner';

if (isLoading) return <PageLoader text="Loading data..." />;
```

### CardLoader
Loading state for card content.

```tsx
import { CardLoader } from '@/components/ui/loading-spinner';

<Card>
  {isLoading ? <CardLoader /> : <CardContent>...</CardContent>}
</Card>
```

### SavingOverlay
Overlay for forms and cards during save operations.

```tsx
import { SavingOverlay } from '@/components/ui/loading-spinner';

<Card className="relative">
  {isSaving && <SavingOverlay text="Saving..." />}
  <CardContent>...</CardContent>
</Card>
```

---

## Context Loading States

### AppointmentContext

```tsx
const { 
  isLoading,      // Initial data fetch
  isRefetching,   // Background refetch
  isCreating,     // Creating appointment
  isUpdating,     // Updating appointment
  isDeleting,     // Deleting appointment
  isSaving        // Any mutation in progress
} = useAppointments();
```

### StaffContext

```tsx
const { 
  isLoading,      // Initial data fetch
  isRefetching,   // Background refetch
  isCreating,     // Creating staff
  isUpdating,     // Updating staff
  isDeleting,     // Deleting staff
  isSaving        // Any mutation in progress
} = useStaffs();
```

### AuthContext

```tsx
const { 
  isLoading,      // Initial auth check
  isRefetching,   // Background auth refresh
  error           // Auth errors
} = useAuth();
```

---

## Usage Patterns

### 1. Page Loading

```tsx
const MyPage = () => {
  const { data, isLoading, error } = useAppointments();

  if (isLoading) return <PageLoader text="Loading..." />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Content */}</div>;
};
```

### 2. Button with Loading

```tsx
const SaveButton = () => {
  const { createAppointment, isCreating } = useAppointments();

  return (
    <Button onClick={handleSave} disabled={isCreating}>
      {isCreating ? (
        <>
          <InlineSpinner className="mr-2" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
};
```

### 3. Form with Overlay

```tsx
const AppointmentForm = () => {
  const { createAppointment, isSaving } = useAppointments();

  return (
    <form className="relative">
      {isSaving && <SavingOverlay />}
      {/* Form fields */}
      <Button type="submit" disabled={isSaving}>
        Submit
      </Button>
    </form>
  );
};
```

### 4. Card with Loader

```tsx
const AppointmentCard = () => {
  const { appointments, isLoading } = useAppointments();

  return (
    <Card>
      {isLoading ? (
        <CardLoader text="Loading appointments..." />
      ) : (
        <CardContent>
          {appointments.map(apt => ...)}
        </CardContent>
      )}
    </Card>
  );
};
```

### 5. Multiple Actions

```tsx
const Actions = ({ id }) => {
  const { 
    updateAppointment, 
    deleteAppointment,
    isUpdating,
    isDeleting 
  } = useAppointments();

  return (
    <>
      <Button onClick={() => updateAppointment(id, {...})} disabled={isUpdating}>
        {isUpdating && <InlineSpinner className="mr-1" />}
        Update
      </Button>
      
      <Button onClick={() => deleteAppointment(id)} disabled={isDeleting}>
        {isDeleting && <InlineSpinner className="mr-1" />}
        Delete
      </Button>
    </>
  );
};
```

### 6. Refetch Indicator

```tsx
const RefreshButton = () => {
  const { refetch, isRefetching } = useAppointments();

  return (
    <Button onClick={() => refetch()} disabled={isRefetching}>
      {isRefetching ? (
        <>
          <InlineSpinner className="mr-2" />
          Refreshing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </>
      )}
    </Button>
  );
};
```

### 7. Full Screen Loading

```tsx
const Dashboard = () => {
  const { appointments, isLoading } = useAppointments();

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading dashboard..." fullScreen />;
  }

  return <div>{/* Dashboard content */}</div>;
};
```

---

## Best Practices

1. **Always disable buttons during mutations**
   ```tsx
   <Button disabled={isCreating || isUpdating}>Save</Button>
   ```

2. **Show visual feedback for all async operations**
   ```tsx
   {isLoading && <InlineSpinner />}
   ```

3. **Use appropriate spinner sizes**
   - `sm` - Inline text, small buttons
   - `md` - Regular buttons, cards
   - `lg` - Page sections
   - `xl` - Full pages

4. **Provide context with text**
   ```tsx
   <LoadingSpinner text="Creating appointment..." />
   ```

5. **Use `isSaving` for combined states**
   ```tsx
   // Disable all actions while any mutation is in progress
   <Button disabled={isSaving}>Action</Button>
   ```

6. **Handle errors gracefully**
   ```tsx
   if (error) {
     return (
       <Alert variant="destructive">
         <AlertDescription>{error.message}</AlertDescription>
       </Alert>
     );
   }
   ```

---

## Examples Location

See complete examples in:
- `src/examples/LoadingSpinnerExamples.tsx` - 11 comprehensive examples
- `src/pages/Appointments.tsx` - Real implementation

---

## Customization

### Custom Spinner Colors

```tsx
<InlineSpinner className="text-blue-500" />
```

### Custom Overlay

```tsx
<div className="relative">
  {isSaving && (
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )}
</div>
```

---

## Summary

✅ **5 spinner components** for different use cases
✅ **6 loading states** per context (isLoading, isRefetching, isCreating, isUpdating, isDeleting, isSaving)
✅ **Integrated with TanStack Query** for automatic state management
✅ **11 usage examples** covering all scenarios
✅ **Implemented in Appointments page** as reference

All contexts now have comprehensive loading states for every operation!
