import { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Clock, AlertTriangle, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {  mockServices, mockStaff, getStaffLoad } from '@/data/mockData';
import { Appointment, AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppointments } from '@/hooks/useAppointments';
import { PageLoader, InlineSpinner, SavingOverlay } from '@/components/ui/loading-spinner';

const statusColors: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-primary/10 text-primary',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-muted text-muted-foreground',
  'No-Show': 'bg-destructive/10 text-destructive',
  Waiting: 'bg-yellow-100 text-yellow-800',
};

const timeSlots = Array.from({ length: 18 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const AppointmentsPage = () => {
  const { appointments, createAppointment, deleteAppointment, isLoading, error, isCreating, isSaving } = useAppointments();
  console.log(appointments)
 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [conflict, setConflict] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    service: '',
    staff: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'Waiting'
  });

  

  const handleOpenDialog = (appointment?: Appointment) => {
    setConflict(null);
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        customerName: appointment.customerName,
        service: appointment.service,
        staff: appointment.staff || '',
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerName: '',
        service: '',
        staff: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '09:30',
        status: 'Scheduled',
      });
    }
    setDialogOpen(true);
  };



  const handleTimeChange = (time: string) => {
   setFormData({ ...formData, startTime: time });
  };

    const handleEndTimeChange = (time: string) => {
 
    setFormData({ ...formData, endTime: time });
  };
  const handleSave = async(e: React.FormEvent) => {
    try {
      const appointment: Appointment = {
        customerName: formData.customerName,
        service: formData.service,
        staff: formData.staff || null,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status as AppointmentStatus,
        
      }
      console.log(appointment)
      await createAppointment(appointment);
      setDialogOpen(false);
      alert('Appointment saved successfully!');
    } catch (error) {
      alert('Failed to save appointment. Please try again.'); 
    }
 
  };

  const handleDelete = async (id: string) => {
    await deleteAppointment(id);
  };

  const getService = (serviceId: string) => mockServices.find((s) => s.id === serviceId);
  const getStaff = (staffId: string | null) => mockStaff.find((s) => s.id === staffId);

  const getEligibleStaff = (serviceId: string) => {
    const service = getService(serviceId);
    if (!service) return [];
    return mockStaff.filter(
      (s) => s.serviceType === service.requiredStaffType && s.availabilityStatus === 'Available'
    );
  };
 const sortedAppointments = useMemo(() => {
    if(!Array.isArray(appointments)) return [];
    return [...appointments].filter(a=> trypeof a.startTime === 'string')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments]);
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Appointments</h2>
            <p className="text-muted-foreground mt-1">Manage and schedule appointments</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gradient-primary text-primary-foreground" disabled={isSaving}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && <PageLoader text="Loading appointments..." />}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load appointments: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {isSaving && <SavingOverlay text="Saving appointment..." />}
          {/* Calendar */}
          <Card className="lg:col-span-1 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md pointer-events-auto"
              />
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <Badge variant="secondary">{appointments?.length} appointments</Badge>
            </div>

            {sortedAppointments.length === 0 ? (
              <Card className="border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No appointments for this date</p>
                  <Button
                    variant="link"
                    className="mt-2 text-primary"
                    onClick={() => handleOpenDialog()}
                  >
                    Create one now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sortedAppointments
                  .map((appointment) => {
                    const service = getService(appointment.service);
                    const staff = getStaff(appointment.staff);

                    return (
                      <Card key={appointment.id} className="border-border/50 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                                <span className="text-lg font-bold">{appointment.startTime}</span>
                                <span className="text-xs">{service?.duration}m</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{appointment.customerName}</h4>
                                <p className="text-sm text-muted-foreground">{service?.name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={statusColors[appointment.status]}>
                                    {appointment.status}
                                  </Badge>
                                  {staff ? (
                                    <span className="text-xs text-muted-foreground">
                                      with {staff.name}
                                    </span>
                                  ) : (
                                    <Badge variant="outline" className="text-warning border-warning">
                                      <Clock className="w-3 h-3 mr-1" />
                                      In Queue
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {/* {appointment.status === 'Scheduled' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-success hover:text-success hover:bg-success/10"
                                    onClick={() => handleStatusChange(appointment.id, 'Completed')}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleStatusChange(appointment.id, 'No-Show')}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )} */}
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(appointment)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(appointment.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </DialogTitle>
              <DialogDescription>
                {editingAppointment
                  ? 'Update the appointment details.'
                  : 'Fill in the details to schedule a new appointment.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => {
                    setFormData({ ...formData, service: value, staff: '' });
                    setConflict(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(formData.date), 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date ? new Date(formData.date) : undefined}
                        onSelect={(date) =>
                          date && setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={formData.startTime} onValueChange={handleTimeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
                 <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select value={formData.endTime} onValueChange={handleEndTimeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff">Assign Staff</Label>

                    <Input
                    placeholder={formData.service ? 'Enter staff name' : 'Select a service first'}
                    disabled={!formData.service}
                    />
                 
              
                {formData.staff && (() => {
                  const { current, max } = getStaffLoad(formData.staff);
                  if (current >= max) {
                    const staff = getStaff(formData.staff);
                    return (
                      <Alert className="mt-2 border-warning bg-warning/10">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <AlertDescription className="text-warning">
                          {staff?.name} already has {max} appointments today.
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  return null;
                })()}
              </div>

              {conflict && (
                <Alert className="border-destructive bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {conflict} Please pick another staff or change the time.
                  </AlertDescription>
                </Alert>
              )}

              {editingAppointment && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: AppointmentStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="No-Show">No-Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="gradient-primary text-primary-foreground"
                disabled={!formData.customerName || !formData.service || !!conflict || isCreating}
              >
                {isCreating ? (
                  <>
                    <InlineSpinner className="mr-2" />
                    {editingAppointment ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  editingAppointment ? 'Save Changes' : 'Create Appointment'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
      </div>
    </AppLayout>
  
  );
};

export default AppointmentsPage;
