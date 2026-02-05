import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export const LoadingSpinner = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className 
}: LoadingSpinnerProps) => {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Inline spinner for buttons and small spaces
export const InlineSpinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);

// Page loader component
export const PageLoader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

// Card loader component
export const CardLoader = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="md" text={text} />
  </div>
);

// Saving overlay component
export const SavingOverlay = ({ text = 'Saving...' }: { text?: string }) => (
  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
    <LoadingSpinner size="md" text={text} />
  </div>
);
