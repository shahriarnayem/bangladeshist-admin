import * as React from 'react';
import { cva } from 'class-variance-authority';
import { CheckIcon, CircleIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
const timelineVariants = cva('grid', {
    variants: {
        positions: {
            left: '[&>li]:grid-cols-[0_min-content_1fr]',
            right: '[&>li]:grid-cols-[1fr_min-content]',
            center: '[&>li]:grid-cols-[1fr_min-content_1fr]'
        }
    },
    defaultVariants: {
        positions: 'left'
    }
});
const Timeline = React.forwardRef(({ children, className, positions, ...props }, ref)=>{
    return <ul className={cn(timelineVariants({
        positions
    }), className)} ref={ref} {...props}>
        {children}
      </ul>;
});
Timeline.displayName = 'Timeline';
const timelineItemVariants = cva('grid items-center gap-x-2', {
    variants: {
        status: {
            done: 'text-primary',
            default: 'text-muted-foreground'
        }
    },
    defaultVariants: {
        status: 'default'
    }
});
const TimelineItem = React.forwardRef(({ className, status, ...props }, ref)=><li className={cn(timelineItemVariants({
        status
    }), className)} ref={ref} {...props}/>);
TimelineItem.displayName = 'TimelineItem';
const timelineDotVariants = cva('col-start-2 col-end-3 row-start-1 row-end-1 flex items-center justify-center rounded-full border border-current', {
    variants: {
        status: {
            default: 'size-4 [&>*]:hidden',
            current: 'size-4 [&>*:not(.timeline-icon-circle)]:hidden [&>.timeline-icon-circle>svg]:fill-current [&>.timeline-icon-circle>svg]:text-current',
            done: 'bg-primary [&>.timeline-icon-check>svg]:text-background size-4 [&>*:not(.timeline-icon-check)]:hidden',
            error: 'border-destructive bg-destructive [&>.timeline-icon-x>svg]:text-background size-4 [&>*:not(.timeline-icon-x)]:hidden',
            custom: 'border-none [&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block'
        }
    },
    defaultVariants: {
        status: 'default'
    }
});
const TimelineDot = React.forwardRef(({ className, status, children, ...props }, ref)=><div role='status' className={cn('timeline-dot', timelineDotVariants({
        status
    }), className)} ref={ref} {...props}>
      <span className='timeline-icon-circle flex items-center justify-center'>
        <CircleIcon className='size-2.5'/>
      </span>
      <span className='timeline-icon-check flex items-center justify-center'>
        <CheckIcon className='size-3'/>
      </span>
      <span className='timeline-icon-x flex items-center justify-center'>
        <XIcon className='size-3'/>
      </span>
      {children}
    </div>);
TimelineDot.displayName = 'TimelineDot';
const timelineTagVariants = cva('row-start-1 row-end-1 flex items-center', {
    variants: {
        side: {
            left: 'col-start-1 col-end-2 justify-end whitespace-nowrap',
            right: 'col-start-3 col-end-4 justify-start'
        }
    },
    defaultVariants: {
        side: 'left'
    }
});
const TimelineTag = React.forwardRef(({ className, side, children, ...props }, ref)=><div className={cn(timelineTagVariants({
        side
    }), className)} ref={ref} {...props}>
      {children}
    </div>);
TimelineTag.displayName = 'TimelineTag';
const timelineContentVariants = cva('text-card-foreground row-start-2 row-end-2 pb-8', {
    variants: {
        side: {
            right: 'col-start-3 col-end-4 mr-auto text-left',
            left: 'col-start-1 col-end-2 ml-auto text-right'
        }
    },
    defaultVariants: {
        side: 'right'
    }
});
const TimelineContent = React.forwardRef(({ className, side, ...props }, ref)=><div className={cn(timelineContentVariants({
        side
    }), className)} ref={ref} {...props}/>);
TimelineContent.displayName = 'TimelineContent';
const timelineHeadingVariants = cva('row-start-1 row-end-1 line-clamp-1 max-w-full truncate', {
    variants: {
        side: {
            right: 'col-start-3 col-end-4 mr-auto text-left',
            left: 'col-start-1 col-end-2 ml-auto text-right'
        },
        variant: {
            primary: 'text-primary text-base font-medium',
            secondary: 'text-muted-foreground text-sm font-light'
        }
    },
    defaultVariants: {
        side: 'right',
        variant: 'primary'
    }
});
const TimelineHeading = React.forwardRef(({ className, side, variant, ...props }, ref)=><p role='heading' aria-level={variant === 'primary' ? 2 : 3} className={cn(timelineHeadingVariants({
        side,
        variant
    }), className)} ref={ref} {...props}/>);
TimelineHeading.displayName = 'TimelineHeading';
const TimelineLine = React.forwardRef(({ className, done = false, ...props }, ref)=>{
    return <hr role='separator' aria-orientation='vertical' className={cn('col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full min-h-16 w-0.5 justify-center rounded-full', done ? 'bg-primary' : 'bg-muted', className)} ref={ref} {...props}/>;
});
TimelineLine.displayName = 'TimelineLine';
export { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineHeading, TimelineLine, TimelineTag };
