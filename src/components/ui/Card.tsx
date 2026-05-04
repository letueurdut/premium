import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, glow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-roulette-card border border-roulette-border rounded-xl p-6',
          hover && 'card-hover cursor-pointer',
          glow && 'glow-red-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export { Card };
export type { CardProps };