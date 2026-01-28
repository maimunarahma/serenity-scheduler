import { useState } from 'react';
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
import { mockAppointments, mockServices, mockStaff, getStaffLoad } from '@/data/mockData';
import { Appointment, AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

const statusColors: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-primary/10 text-primary',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-muted text-muted-foreground',
  'No-Show': 'bg-destructive/10 text-destructive',
};

const timeSlots = Array.from({ length: 18 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [conflict, setConflict] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    serviceId: '',
    assignedStaffId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'Scheduled' as AppointmentStatus,
  });

  const filteredAppointments = appointments.filter(
    (apt) => apt.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleOpenDialog = (appointment?: Appointment) => {
    setConflict(null);
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        customerName: appointment.customerName,
        serviceId: appointment.serviceId,
        assignedStaffId: appointment.assignedStaffId || '',
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerName: '',
        serviceId: '',
        assignedStaffId: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '09:00',
        status: 'Scheduled',
      });
    }
    setDialogOpen(true);
  };

  const checkConflict = (staffId: string, date: string, time: string, excludeId?: string) => {
    const existingAppointment = appointments.find(
      (apt) =>
        apt.assignedStaffId === staffId &&
        apt.date === date &&
        apt.time === time &&
        apt.id !== excludeId &&
        apt.status !== 'Cancelled'
    );
    return existingAppointment;
  };

  const handleStaffChange = (staffId: string) => {
    const conflictingApt = checkConflict(staffId, formData.date, formData.time, editingAppointment?.id);
    const staff = mockStaff.find((s) => s.id === staffId);
    
    if (conflictingApt) {
      setConflict(`${staff?.name} already has an appointment at this time.`);
    } else {
      setConflict(null);
    }
    setFormData({ ...formData, assignedStaffId: staffId });
  };

  const handleTimeChange = (time: string) => {
    if (formData.assignedStaffId) {
      const conflictingApt = checkConflict(formData.assignedStaffId, formData.date, time, editingAppointment?.id);
      const staff = mockStaff.find((s) => s.id === formData.assignedStaffId);
      
      if (conflictingApt) {
        setConflict(`${staff?.name} already has an appointment at this time.`);
      } else {
        setConflict(null);
      }
    }
    setFormData({ ...formData, time });
  };

  const handleSave = () => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === editingAppointment.id ? { ...apt, ...formData } : apt
        )
      );
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setAppointments([...appointments, newAppointment]);
    }
    setDialogOpen(false);
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
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

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Appointments</h2>
            <p className="text-muted-foreground mt-1">Manage and schedule appointments</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <Badge variant="secondary">{filteredAppointments.length} appointments</Badge>
            </div>

            {filteredAppointments.length === 0 ? (
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
                {filteredAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => {
                    const service = getService(appointment.serviceId);
                    const staff = getStaff(appointment.assignedStaffId);

                    return (
                      <Card key={appointment.id} className="border-border/50 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                                <span className="text-lg font-bold">{appointment.time}</span>
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
                              {appointment.status === 'Scheduled' && (
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
                              )}
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

        {/* Appointment Dialog */}
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
                  value={formData.serviceId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, serviceId: value, assignedStaffId: '' });
                    setConflict(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
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
                        selected={new Date(formData.date)}
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
                  <Label htmlFor="time">Time</Label>
                  <Select value={formData.time} onValueChange={handleTimeChange}>
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
                <Select
                  value={formData.assignedStaffId}
                  onValueChange={handleStaffChange}
                  disabled={!formData.serviceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.serviceId ? 'Select staff' : 'Select a service first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {getEligibleStaff(formData.serviceId).map((staff) => {
                      const { current, max } = getStaffLoad(staff.id);
                      const isOverloaded = current >= max;
                      return (
                        <SelectItem key={staff.id} value={staff.id}>
                          <div className="flex items-center gap-2">
                            <span>{staff.name}</span>
                            <span className={cn('text-xs', isOverloaded ? 'text-destructive' : 'text-muted-foreground')}>
                              ({current} / {max})
                            </span>
                            {isOverloaded && <AlertTriangle className="w-3 h-3 text-warning" />}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {formData.assignedStaffId && (() => {
                  const { current, max } = getStaffLoad(formData.assignedStaffId);
                  if (current >= max) {
                    const staff = getStaff(formData.assignedStaffId);
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="gradient-primary text-primary-foreground"
                disabled={!formData.customerName || !formData.serviceId || !!conflict}
              >
                {editingAppointment ? 'Save Changes' : 'Create Appointment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AppointmentsPage;
