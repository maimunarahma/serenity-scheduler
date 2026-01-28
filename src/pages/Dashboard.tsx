import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import StaffLoadItem from '@/components/dashboard/StaffLoadItem';
import ActivityLogItem from '@/components/dashboard/ActivityLogItem';
import { mockStaff, mockAppointments, mockQueueItems, mockActivityLogs } from '@/data/mockData';

const Dashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter((apt) => apt.date === today);
  const completedToday = todayAppointments.filter((apt) => apt.status === 'Completed').length;
  const pendingToday = todayAppointments.filter((apt) => apt.status === 'Scheduled').length;
  const availableStaff = mockStaff.filter((s) => s.availabilityStatus === 'Available');

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Good morning, John!</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your appointments today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Appointments Today"
            value={todayAppointments.length}
            subtitle={`${pendingToday} pending`}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={completedToday}
            subtitle="Today's completed"
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Waiting Queue"
            value={mockQueueItems.length}
            subtitle="Awaiting assignment"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Available Staff"
            value={availableStaff.length}
            subtitle={`${mockStaff.length - availableStaff.length} on leave`}
            icon={Users}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Load Summary */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Staff Load Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {availableStaff.map((staff) => (
                <StaffLoadItem key={staff.id} staff={staff} />
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockActivityLogs.slice(0, 5).map((log) => (
                <ActivityLogItem key={log.id} log={log} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your appointments efficiently
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/appointments"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  New Appointment
                </a>
                <a
                  href="/queue"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Assign Queue
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
