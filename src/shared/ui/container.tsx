import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto max-w-[1400px] px-5 md:px-8', className)}>{children}</div>;
}
