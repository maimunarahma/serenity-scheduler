import { useState } from 'react';
import { Plus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { mockStaff, getStaffLoad } from '@/data/mockData';
import { Staff, StaffType, AvailabilityStatus } from '@/types';
import { cn } from '@/lib/utils';

const staffTypes: StaffType[] = ['Doctor', 'Consultant', 'Support Agent'];

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: 'Doctor' as StaffType,
    dailyCapacity: 5,
    availabilityStatus: 'Available' as AvailabilityStatus,
  });

  const handleOpenDialog = (staffMember?: Staff) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        name: staffMember.name,
        serviceType: staffMember.serviceType,
        dailyCapacity: staffMember.dailyCapacity,
        availabilityStatus: staffMember.availabilityStatus,
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        serviceType: 'Doctor',
        dailyCapacity: 5,
        availabilityStatus: 'Available',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingStaff) {
      setStaff(staff.map((s) => (s.id === editingStaff.id ? { ...s, ...formData } : s)));
    } else {
      const newStaff: Staff = {
        id: Date.now().toString(),
        ...formData,
      };
      setStaff([...staff, newStaff]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setStaff(
      staff.map((s) =>
        s.id === id
          ? { ...s, availabilityStatus: s.availabilityStatus === 'Available' ? 'On Leave' : 'Available' }
          : s
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Staff Management</h2>
            <p className="text-muted-foreground mt-1">Manage your team members and their availability</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </DialogTitle>
                <DialogDescription>
                  {editingStaff
                    ? 'Update the staff member details below.'
                    : 'Fill in the details to add a new team member.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value: StaffType) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {staffTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Daily Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    max={20}
                    value={formData.dailyCapacity}
                    onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Availability Status</Label>
                  <Select
                    value={formData.availabilityStatus}
                    onValueChange={(value: AvailabilityStatus) =>
                      setFormData({ ...formData, availabilityStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gradient-primary text-primary-foreground">
                  {editingStaff ? 'Save Changes' : 'Add Staff'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => {
            const { current, max } = getStaffLoad(member.id);
            const isAvailable = member.availabilityStatus === 'Available';

            return (
              <Card key={member.id} className="staff-card overflow-hidden">
                <CardContent className="p-0">
                  <div className={cn('h-2', isAvailable ? 'gradient-primary' : 'bg-muted')} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold',
                            isAvailable ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.serviceType}</p>
                        </div>
                      </div>
                      <Badge variant={isAvailable ? 'default' : 'secondary'} className={cn(
                        isAvailable ? 'bg-success text-success-foreground' : ''
                      )}>
                        {member.availabilityStatus}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Today's Load</span>
                        <span className="font-medium text-foreground">
                          {current} / {max}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            current >= max
                              ? 'bg-destructive'
                              : current >= max - 1
                              ? 'bg-warning'
                              : 'bg-success'
                          )}
                          style={{ width: `${(current / max) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAvailability(member.id)}
                        className="flex-1"
                      >
                        {isAvailable ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Set Leave
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Set Available
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(member)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(member.id)}
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
      </div>
    </AppLayout>
  );
};

export default StaffPage;
