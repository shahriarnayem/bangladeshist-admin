export const EVENT_TYPE_OPTIONS = [
    {
        value: 'family',
        label: 'Editorial',
        bgClass: 'data-checked:bg-foreground/70 dark:data-checked:bg-foreground/70',
        borderClass: 'data-checked:border-foreground/70',
        dotClass: 'bg-foreground/70'
    },
    {
        value: 'business',
        label: 'Business',
        bgClass: 'data-checked:bg-foreground/50 dark:data-checked:bg-foreground/50',
        borderClass: 'data-checked:border-foreground/50',
        dotClass: 'bg-foreground/50'
    },
    {
        value: 'personal',
        label: 'Personal',
        bgClass: 'data-checked:bg-foreground/40 dark:data-checked:bg-foreground/40',
        borderClass: 'data-checked:border-foreground/40',
        dotClass: 'bg-foreground/40'
    },
    {
        value: 'holiday',
        label: 'Deadline',
        bgClass: 'data-checked:bg-foreground/85 dark:data-checked:bg-foreground/85',
        borderClass: 'data-checked:border-foreground/85',
        dotClass: 'bg-foreground/85'
    },
    {
        value: 'etc',
        label: 'Other',
        bgClass: 'data-checked:bg-foreground/30 dark:data-checked:bg-foreground/30',
        borderClass: 'data-checked:border-foreground/30',
        dotClass: 'bg-foreground/30'
    }
];
export const EVENT_TYPE_DOT_CLASSES = Object.fromEntries(EVENT_TYPE_OPTIONS.map((option)=>[
        option.value,
        option.dotClass
    ]));
export const ALL_EVENT_TYPES = EVENT_TYPE_OPTIONS.map((option)=>option.value);
