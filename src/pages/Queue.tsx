import { useState } from 'react';
import { Clock, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockQueueItems, mockQueueAppointments, mockServices, mockStaff, getStaffLoad } from '@/data/mockData';
import { Appointment, QueueItem, Staff } from '@/types';
import { cn } from '@/lib/utils';

const QueuePage = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(mockQueueItems);
  const [queueAppointments, setQueueAppointments] = useState<Appointment[]>(mockQueueAppointments);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueItem | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  const getAppointment = (appointmentId: string) =>
    queueAppointments.find((apt) => apt.id === appointmentId);

  const getService = (serviceId: string) => mockServices.find((s) => s.id === serviceId);

  const getEligibleStaff = (serviceId: string): Staff[] => {
    const service = getService(serviceId);
    if (!service) return [];
    return mockStaff.filter(
      (s) => s.serviceType === service.requiredStaffType && s.availabilityStatus === 'Available'
    );
  };

  const handleOpenAssignDialog = (queueItem: QueueItem) => {
    setSelectedQueueItem(queueItem);
    setSelectedStaffId('');
    setAssignDialogOpen(true);
  };

  const handleAssign = () => {
    if (!selectedQueueItem || !selectedStaffId) return;

    // Remove from queue
    setQueueItems(queueItems.filter((item) => item.id !== selectedQueueItem.id));

    // Update appointment with assigned staff
    setQueueAppointments(
      queueAppointments.map((apt) =>
        apt.id === selectedQueueItem.appointmentId
          ? { ...apt, assignedStaffId: selectedStaffId }
          : apt
      )
    );

    // Reorder remaining queue positions
    setQueueItems((items) =>
      items.map((item, index) => ({ ...item, position: index + 1 }))
    );

    setAssignDialogOpen(false);
  };

  const handleAutoAssign = (queueItem: QueueItem) => {
    const appointment = getAppointment(queueItem.appointmentId);
    if (!appointment) return;

    const eligibleStaff = getEligibleStaff(appointment.serviceId);
    
    // Find staff with lowest load
    let bestStaff: Staff | null = null;
    let lowestLoad = Infinity;

    for (const staff of eligibleStaff) {
      const { current, max } = getStaffLoad(staff.id);
      if (current < max && current < lowestLoad) {
        lowestLoad = current;
        bestStaff = staff;
      }
    }

    if (bestStaff) {
      setQueueItems(queueItems.filter((item) => item.id !== queueItem.id));
      setQueueAppointments(
        queueAppointments.map((apt) =>
          apt.id === queueItem.appointmentId
            ? { ...apt, assignedStaffId: bestStaff!.id }
            : apt
        )
      );
      setQueueItems((items) =>
        items.map((item, index) => ({ ...item, position: index + 1 }))
      );
    }
  };

  const getPositionBadge = (position: number) => {
    const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
    const suffix = suffixes[position] || 'th';
    return `${position}${suffix}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Waiting Queue</h2>
            <p className="text-muted-foreground mt-1">
              Appointments awaiting staff assignment
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {queueItems.length} in queue
          </Badge>
        </div>

        {queueItems.length === 0 ? (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Queue is empty!</h3>
              <p className="text-muted-foreground text-center max-w-md">
                All appointments have been assigned to staff members. New unassigned appointments will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queueItems
              .sort((a, b) => a.position - b.position)
              .map((queueItem) => {
                const appointment = getAppointment(queueItem.appointmentId);
                if (!appointment) return null;

                const service = getService(appointment.serviceId);
                const eligibleStaff = getEligibleStaff(appointment.serviceId);
                const hasAvailableStaff = eligibleStaff.some((s) => {
                  const { current, max } = getStaffLoad(s.id);
                  return current < max;
                });

                return (
                  <Card
                    key={queueItem.id}
                    className={cn(
                      'queue-item border-l-4',
                      queueItem.position === 1
                        ? 'border-l-warning'
                        : queueItem.position === 2
                        ? 'border-l-primary/50'
                        : 'border-l-border'
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold',
                              queueItem.position === 1
                                ? 'gradient-accent text-accent-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <span className="text-xs">Queue</span>
                            <span className="text-lg">{getPositionBadge(queueItem.position)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">
                              {appointment.customerName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{service?.name}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </span>
                              <span>•</span>
                              <span>{service?.duration} min</span>
                              <span>•</span>
                              <span>Requires: {service?.requiredStaffType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {!hasAvailableStaff ? (
                            <div className="flex items-center gap-2 text-sm text-warning">
                              <AlertCircle className="w-4 h-4" />
                              No available staff
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => handleAutoAssign(queueItem)}
                                className="gap-2"
                              >
                                <ArrowRight className="w-4 h-4" />
                                Auto Assign
                              </Button>
                              <Button
                                onClick={() => handleOpenAssignDialog(queueItem)}
                                className="gradient-primary text-primary-foreground gap-2"
                              >
                                <UserPlus className="w-4 h-4" />
                                Assign Staff
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {/* Staff Availability Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Staff Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockStaff
                .filter((s) => s.availabilityStatus === 'Available')
                .map((staff) => {
                  const { current, max } = getStaffLoad(staff.id);
                  const percentage = (current / max) * 100;
                  const isOverloaded = current >= max;

                  return (
                    <div
                      key={staff.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        isOverloaded ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {staff.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.serviceType}</p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            isOverloaded
                              ? 'bg-destructive/10 text-destructive'
                              : current >= max - 1
                              ? 'bg-warning/10 text-warning'
                              : 'bg-success/10 text-success'
                          )}
                        >
                          {current}/{max}
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            isOverloaded
                              ? 'bg-destructive'
                              : current >= max - 1
                              ? 'bg-warning'
                              : 'bg-success'
                          )}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Assign Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Assign Staff</DialogTitle>
              <DialogDescription>
                Select a staff member to assign this appointment to.
              </DialogDescription>
            </DialogHeader>
            {selectedQueueItem && (() => {
              const appointment = getAppointment(selectedQueueItem.appointmentId);
              if (!appointment) return null;

              const service = getService(appointment.serviceId);
              const eligibleStaff = getEligibleStaff(appointment.serviceId);

              return (
                <div className="py-4 space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground">{appointment.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {service?.name} at {appointment.time}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Staff Member</label>
                    <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleStaff.map((staff) => {
                          const { current, max } = getStaffLoad(staff.id);
                          const isOverloaded = current >= max;
                          return (
                            <SelectItem
                              key={staff.id}
                              value={staff.id}
                              disabled={isOverloaded}
                            >
                              <div className="flex items-center gap-2">
                                <span>{staff.name}</span>
                                <span
                                  className={cn(
                                    'text-xs',
                                    isOverloaded ? 'text-destructive' : 'text-muted-foreground'
                                  )}
                                >
                                  ({current}/{max})
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedStaffId}
                className="gradient-primary text-primary-foreground"
              >
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default QueuePage;
