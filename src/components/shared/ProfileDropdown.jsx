'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    LogOutIcon,
    SettingsIcon,
    UserIcon,
    ShieldIcon,
    UsersIcon,
    CheckIcon,
    RefreshCwIcon,
    SparklesIcon,
    FileTextIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function ProfileDropdown() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: 'Editorial Desk',
        email: 'editor@thechronicle.press',
        role: 'SUPER_ADMIN',
        image: ''
    });
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setUser(data.profile);
                }
                if (data.availableUsers) {
                    setAvailableUsers(data.availableUsers);
                }
            }
        } catch {
            // Fallback
        }
    };

    useEffect(() => {
        loadProfile();

        const handlePersonaChanged = (e) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
            } else {
                loadProfile();
            }
        };

        window.addEventListener('user-persona-changed', handlePersonaChanged);
        return () => {
            window.removeEventListener('user-persona-changed', handlePersonaChanged);
        };
    }, []);

    const handleSwitchUser = async (targetUser) => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'switch',
                    userId: targetUser.id
                })
            });
            const data = await res.json();
            if (data.success && data.profile) {
                setUser(data.profile);
                toast.success(`Dashboard role active as: ${data.profile.name} (${data.profile.role})`);

                // Dispatch global event so Sidebar and Dashboard reload role-restricted panels
                window.dispatchEvent(
                    new CustomEvent('user-persona-changed', {
                        detail: {
                            role: data.profile.role,
                            user: data.profile,
                            name: data.profile.name
                        }
                    })
                );

                router.refresh();
            } else {
                toast.error(data.error || 'Failed to switch user persona');
            }
        } catch {
            toast.error('Network error switching persona');
        } finally {
            setLoading(false);
        }
    };

    const initials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'ED';

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
                return 'border-primary bg-primary/10 text-primary';
            case 'EDITOR':
                return 'border-blue-500 bg-blue-500/10 text-blue-500';
            case 'AUTHOR':
                return 'border-amber-500 bg-amber-500/10 text-amber-500';
            default:
                return 'border-muted text-muted-foreground';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-transparent">
                        <Avatar className="size-8 border">
                            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                            <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-emerald-500 ring-2" />
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-3 px-2.5 py-2.5 font-normal">
                        <div className="relative shrink-0">
                            <Avatar className="size-10 border">
                                {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                                <AvatarFallback className="text-sm font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-emerald-500 ring-2" />
                        </div>
                        <div className="flex flex-1 flex-col items-start min-w-0">
                            <span className="text-foreground text-sm font-semibold truncate w-full">{user.name}</span>
                            <span className="text-muted-foreground text-xs font-mono truncate w-full">{user.email}</span>
                            <div className="mt-1">
                                <Badge variant="outline" className={`text-[9px] h-4 font-mono uppercase px-1.5 ${getRoleBadgeVariant(user.role)}`}>
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer" />}>
                        <UserIcon className="size-4" />
                        <span>Profile &amp; Settings</span>
                    </DropdownMenuItem>

                    {/* Switch Persona / Role Testing Submenu */}
                    {availableUsers.length > 0 && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                                <ShieldIcon className="size-4" />
                                <span>Switch Role Persona</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-56 max-h-72 overflow-y-auto">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    Test Dashboard as Role:
                                </DropdownMenuLabel>
                                {availableUsers.map((u) => {
                                    const isCurrent = u.id === user.id;
                                    return (
                                        <DropdownMenuItem
                                            key={u.id}
                                            onClick={() => handleSwitchUser(u)}
                                            className="flex items-center justify-between gap-2 cursor-pointer"
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium truncate">{u.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                    {u.role}
                                                </span>
                                            </div>
                                            {isCurrent && <CheckIcon className="size-3.5 text-primary shrink-0" />}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        render={<Link href="/pages/auth/login" className="flex items-center gap-2 cursor-pointer" />}
                    >
                        <LogOutIcon className="size-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
