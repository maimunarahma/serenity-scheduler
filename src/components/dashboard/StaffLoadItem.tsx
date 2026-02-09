import { Staff } from '@/types';
import { getStaffAppointmentsToday } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface StaffLoadItemProps {
  staff: Staff;
}

const StaffLoadItem = ({ staff }: StaffLoadItemProps) => {
  const appointments = getStaffAppointmentsToday(staff.id);
  const current = appointments.length;
  const max = staff.dailyCapacity;
  const percentage = (current / max) * 100;
  const isOverloaded = current >= max;
  const isNearCapacity = current >= max - 1 && !isOverloaded;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-semibold text-primary">
          {staff.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-foreground truncate">{staff.name}</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              isOverloaded ? 'text-destructive' : isNearCapacity ? 'text-warning' : 'text-foreground'
            )}>
              {current} / {max}
            </span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              isOverloaded 
                ? 'bg-destructive/10 text-destructive' 
                : isNearCapacity 
                ? 'bg-warning/10 text-warning'
                : 'bg-success/10 text-success'
            )}>
              {isOverloaded ? 'Booked' : isNearCapacity ? 'Busy' : 'OK'}
            </span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isOverloaded 
                ? 'bg-destructive' 
                : isNearCapacity 
                ? 'bg-warning'
                : 'bg-success'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffLoadItem;
