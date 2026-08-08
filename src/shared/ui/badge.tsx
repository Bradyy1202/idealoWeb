import { cn } from '@/shared/lib/cn';

export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}
