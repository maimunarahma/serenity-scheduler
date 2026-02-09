import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Users, Filter } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ActivityLog, Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { useAppointmentContext } from '@/hooks/useAppointments';


const typeConfig = {
  assignment: { icon: Users, color: 'text-primary', bg: 'bg-primary/10', label: 'Assignment' },
  queue: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Queue' },
  status: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Status' },
  conflict: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Conflict' },
};

const ActivityPage = () => {
  const [filter, setFilter] = useState<string>('all');
  
 const { appointments } = useAppointmentContext();
  const filteredLogs =
    filter === 'all'
      ? appointments
      : appointments.filter((log) => log.status === filter);
  const groupLogsByDate = (logs: Appointment[]) => {
    const groups: Record<string, Appointment[]> = {};
    logs.forEach((log) => {
      const date = format(new Date(log.date), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    return groups;
  };

  const groupedLogs = groupLogsByDate(filteredLogs);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Activity Log</h2>
            <p className="text-muted-foreground mt-1">Track all important system actions</p>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="queue">Queue</SelectItem>
                <SelectItem value="status">Status Changes</SelectItem>
                <SelectItem value="conflict">Conflicts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(typeConfig).map(([type, config]) => {
            const count = appointments.filter((log) => log.status === type).length;
            const Icon = config.icon;
            return (
              <Card
                key={type}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  filter === type ? 'ring-2 ring-primary' : ''
                )}
                onClick={() => setFilter(filter === type ? 'all' : type)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Timeline */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
              <Badge variant="secondary" className="ml-2">
                {filteredLogs.length} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(groupedLogs).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No activities found</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedLogs).map(([date, logs]) => (
                  <div key={date}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-4">
                      {logs
                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                        .map((log) => {
                          const config = typeConfig[log.status];
                          const Icon = config?.icon;

                          return (
                            <div
                              key={log.id}
                              className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                  config.bg
                                )}
                              >
                                <Icon className={cn('w-5 h-5', config.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                {/* <p className="text-sm text-foreground">{log.message}</p> */}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(log.startTime), 'h:mm a')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(log.startTime), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="secondary" className={cn('text-xs', config.bg, config.color)}>
                                {config.label}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredLogs.length > 10 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ActivityPage;
