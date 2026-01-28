import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Users } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockServices } from '@/data/mockData';
import { Service, StaffType, ServiceDuration } from '@/types';

const staffTypes: StaffType[] = ['Doctor', 'Consultant', 'Support Agent'];
const durations: ServiceDuration[] = [15, 30, 60];

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: 30 as ServiceDuration,
    requiredStaffType: 'Doctor' as StaffType,
    description: '',
  });

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        duration: service.duration,
        requiredStaffType: service.requiredStaffType,
        description: service.description || '',
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        duration: 30,
        requiredStaffType: 'Doctor',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s)));
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
      };
      setServices([...services, newService]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const getDurationColor = (duration: ServiceDuration) => {
    switch (duration) {
      case 15:
        return 'bg-success/10 text-success';
      case 30:
        return 'bg-primary/10 text-primary';
      case 60:
        return 'bg-warning/10 text-warning';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Services</h2>
            <p className="text-muted-foreground mt-1">Define and manage your service offerings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription>
                  {editingService
                    ? 'Update the service details below.'
                    : 'Fill in the details to create a new service.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., General Consultation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) as ServiceDuration })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffType">Required Staff Type</Label>
                  <Select
                    value={formData.requiredStaffType}
                    onValueChange={(value: StaffType) => setFormData({ ...formData, requiredStaffType: value })}
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gradient-primary text-primary-foreground">
                  {editingService ? 'Save Changes' : 'Add Service'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="staff-card group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDurationColor(service.duration)}>
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration} min
                  </Badge>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {service.requiredStaffType}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleOpenDialog(service)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ServicesPage;
