import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  success: 'gradient-success text-success-foreground',
  warning: 'bg-warning/10 border-warning/20',
  danger: 'bg-destructive/10 border-destructive/20',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-success-foreground/20 text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-destructive text-destructive-foreground',
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  return (
    <div
      className={cn(
        'stat-card animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
            )}
          >
            {title}
          </p>
          <div className="flex items-end gap-2">
            <h3
              className={cn(
                'text-3xl font-display font-bold',
                variant === 'default' ? 'text-foreground' : ''
              )}
            >
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium mb-1',
                  trend.positive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p
              className={cn(
                'text-sm',
                variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            iconStyles[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
