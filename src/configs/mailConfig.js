// Third-party Imports
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
export const MAIL_CURRENT_USER = {
    name: 'Editorial Desk',
    email: 'editor@thechronicle.press',
    avatar: undefined
};
export const MAIL_STATUS_NAV_ITEMS = [
    {
        id: 'inbox',
        label: 'Inbox'
    },
    {
        id: 'drafts',
        label: 'Drafts'
    },
    {
        id: 'sent',
        label: 'Sent'
    },
    {
        id: 'spam',
        label: 'Spam'
    },
    {
        id: 'trash',
        label: 'Trash'
    },
    {
        id: 'archive',
        label: 'Archive'
    }
];
export const MAIL_LABEL_NAV_ITEMS = [
    {
        id: 'social',
        label: 'Social'
    },
    {
        id: 'updates',
        label: 'Updates'
    },
    {
        id: 'forums',
        label: 'Forums'
    },
    {
        id: 'shopping',
        label: 'Shopping'
    },
    {
        id: 'promotions',
        label: 'Promotions'
    }
];
export const MAIL_LABEL_STYLES = [
    {
        id: 'social',
        label: 'Social',
        color: 'bg-foreground/40'
    },
    {
        id: 'updates',
        label: 'Updates',
        color: 'bg-foreground/60'
    },
    {
        id: 'forums',
        label: 'Forums',
        color: 'bg-foreground/50'
    },
    {
        id: 'shopping',
        label: 'Shopping',
        color: 'bg-foreground/30'
    },
    {
        id: 'promotions',
        label: 'Promotions',
        color: 'bg-foreground/70'
    }
];
export const getInitialsFromName = (name)=>{
    return name.split(' ').map((namePart)=>namePart[0]).join('');
};
export const formatMailDate = (date)=>{
    const diffMs = Date.now() - date.getTime();
    if (diffMs < 60_000) {
        return 'Just now';
    }
    if (isToday(date)) {
        return formatDistanceToNow(date, {
            addSuffix: true
        }).replace(/^about /, '');
    }
    if (isYesterday(date)) {
        return 'Yesterday';
    }
    return format(date, 'MMM d');
};
