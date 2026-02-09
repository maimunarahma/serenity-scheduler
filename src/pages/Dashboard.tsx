import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import StaffLoadItem from '@/components/dashboard/StaffLoadItem';
import ActivityLogItem from '@/components/dashboard/ActivityLogItem';
import { useStaff } from '@/hooks/useStaff';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useAppointmentContext } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';

// Bangladesh timezone
const BD_TIMEZONE = 'Asia/Dhaka';


const Dashboard = () => {
  const { user } = useAuth();
  const { staff, isLoading } = useStaff();
  const { appointments} = useAppointmentContext();
  
  const today = new Date()
  const todayAppointments = appointments.filter((apt) =>{
    const aptDate = new Date(apt.date);
    return aptDate.getFullYear() === today.getFullYear() &&
            aptDate.getMonth() === today.getMonth() &&
            aptDate.getDate() === today.getDate();
  });
  
  const completedToday = todayAppointments.filter((apt) => apt.status === 'Completed').length;
  const pendingToday = todayAppointments.filter((apt) => apt.status === 'Scheduled').length;
  const availableStaff = staff.filter((s) => s.status === 'Available');
  const onLeaveStaff = staff.filter((s) => s.status === 'On Leave');
  
  // Generate activity logs dynamically from appointments
  const recentActivity = appointments
    .filter(apt => apt.createdAt) // Only appointments with createdAt
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5)
    .map(apt => {
      const staffMember = staff.find(s => s._id === apt.staff);
      let message = '';
      let type: 'assignment' | 'status' | 'queue' | 'conflict' = 'status';
      
      if (apt.status === 'Completed') {
        message = `Appointment for "${apt.customerName}" marked as completed${staffMember ? ` by ${staffMember.name}` : ''}.`;
        type = 'status';
      } else if (apt.status === 'Scheduled' && apt.staff) {
        message = `Appointment for "${apt.customerName}" assigned to ${staffMember ? staffMember.name : 'staff member'}.`;
        type = 'assignment';
      } else if (apt.status === 'Cancelled') {
        message = `Appointment for "${apt.customerName}" cancelled.`;
        type = 'status';
      } else if (apt.status === 'Waiting') {
        message = `"${apt.customerName}" added to queue.`;
        type = 'queue';
      } else {
        message = `New appointment for "${apt.customerName}" created.`;
        type = 'assignment';
      }
      
      return {
        id: apt.id || `activity-${apt.customerName}`,
        message,
        timestamp: apt.createdAt!,
        type
      };
    });
  
  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Good morning, {user?.email}!</h2>
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
            value={appointments.filter((apt) => apt.status === 'Waiting' && apt.staff === null).length}
            subtitle="Awaiting assignment"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Available Staff"
            value={availableStaff.length}
            subtitle={`${onLeaveStaff.length} on leave`}
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
              { availableStaff.length > 0 ? (
                availableStaff.map((staffMember) => (
                  <StaffLoadItem key={staffMember._id} staff={staffMember} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No available staff today
                </p>
              )}
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
              {recentActivity.length > 0 ? (
                recentActivity.map((log) => (
                  <ActivityLogItem key={log.id} log={log} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent activity
                </p>
              )}
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
