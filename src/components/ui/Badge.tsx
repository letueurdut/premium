import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'red' | 'green' | 'yellow';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-roulette-dark text-roulette-muted border-roulette-border',
    red: 'bg-red-900/30 text-red-300 border-red-800',
    green: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
    yellow: 'bg-amber-900/30 text-amber-300 border-amber-800',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-body', variants[variant], className)}>
      {children}
    </span>
  );
}

export type { BadgeProps };