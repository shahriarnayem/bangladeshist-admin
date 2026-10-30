'use client';
// Utils Imports
import { cn } from '@/lib/utils';
export function CalendarCell({ time, children, className, onClick }) {
    // Format time for display in tooltip (only for debugging)
    const formattedTime = time !== undefined ? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60).toString().padStart(2, '0')}` : null;
    return <div onClick={onClick} className={cn('flex h-full flex-col overflow-hidden px-0.5 py-1 sm:px-1', className)} title={formattedTime ? `${formattedTime}` : undefined}>
      {children}
    </div>;
}
