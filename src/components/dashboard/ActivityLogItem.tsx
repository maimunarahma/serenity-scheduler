import { ActivityLog } from '@/types';
import { Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const BD_TIMEZONE = 'Asia/Dhaka';

interface ActivityLogItemProps {
  log: ActivityLog;
}

const typeConfig = {
  assignment: { icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  queue: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  status: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  conflict: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

const ActivityLogItem = ({ log }: ActivityLogItemProps) => {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  // Convert timestamp to Bangladesh timezone
  const bdTime = toZonedTime(new Date(log.timestamp), BD_TIMEZONE);

  return (
    <div className="activity-log-item animate-fade-in">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{log.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(bdTime, { addSuffix: true })} (BD Time)
        </p>
      </div>
    </div>
  );
};

export default ActivityLogItem;
