'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
// Next Imports
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
// Third-party Imports
import * as Icon from 'lucide-react';
import { ChevronRightIcon, SquareArrowOutUpRightIcon, ShieldCheckIcon } from 'lucide-react';
// Component Imports
import LogoSvg from '@/assets/svg/logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
// Config Imports
import { navItems } from '@/configs/navConfig';
import themeConfig from '@/configs/themeConfig';
// Util Imports
import { cn } from '@/lib/utils';
import { getNavApps } from '@/lib/nav-apps';

const isSubGroup = (item) => 'childItems' in item;
const isExternalLink = (href) => href.startsWith('http://') || href.startsWith('https://');
const subGroupKey = (itemLabel, subItemLabel) => `${itemLabel}::${subItemLabel}`;

function isLinkActive(href, activePath, pathname, searchParams) {
    if (activePath) {
        return pathname.startsWith(activePath);
    }
    if (href.includes('?')) {
        const [hrefPath, hrefQuery] = href.split('?');
        if (pathname !== hrefPath) return false;
        const hrefParams = new URLSearchParams(hrefQuery);
        for (const [key, value] of hrefParams.entries()) {
            if (searchParams.get(key) !== value) return false;
        }
        return true;
    }
    return pathname === href;
}

function getActiveBranchKeys(groups, pathname, searchParams) {
    const keys = new Set();
    groups.forEach((group) => {
        group.items.forEach((item) => {
            item.childItems?.forEach((subItem) => {
                if (isSubGroup(subItem)) {
                    if (subItem.childItems.some((leaf) => isLinkActive(leaf.href, leaf.activePath, pathname, searchParams))) {
                        keys.add(item.label);
                        keys.add(subGroupKey(item.label, subItem.label));
                    }
                } else if (isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)) {
                    keys.add(item.label);
                }
            });
        });
    });
    return keys;
}

const FlyoutMenuLink = ({ item, isActive }) => (
    <DropdownMenuItem
        className={cn('justify-between gap-2', isActive && 'bg-primary/10 text-accent-foreground font-medium')}
        render={<Link href={item.href} target={item.target} />}
    >
        <span className="truncate">{item.label}</span>
        <div className="flex items-center gap-2">
            {item.badge && (
                <span className={cn('bg-primary/10 ml-auto rounded-full px-1.5 text-xs font-normal', item.badgeClassName)}>
                    {item.badge}
                </span>
            )}
            {isExternalLink(item.href) && <SquareArrowOutUpRightIcon className="ml-auto size-3.5 shrink-0 opacity-50" />}
        </div>
    </DropdownMenuItem>
);

const FlyoutMenuItem = ({ item, childItems, isChildActive, pathname, searchParams }) => {
    const Tag = item.icon ? Icon[item.icon] : null;
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton isActive={isChildActive} className="data-active:bg-primary/5!" />}>
                    {Tag && <Tag />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <ChevronRightIcon className="ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-auto min-w-52">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-foreground flex items-center gap-2 text-sm">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                                <span className={cn('bg-primary/10 rounded-full px-1.5 text-xs font-normal', item.badgeClassName)}>
                                    {item.badge}
                                </span>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {childItems.map((subItem) =>
                            isSubGroup(subItem) ? (
                                <DropdownMenuSub key={subItem.label}>
                                    <DropdownMenuSubTrigger
                                        className={cn(
                                            subItem.childItems.some((leaf) => isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)) &&
                                                'bg-primary/10 text-accent-foreground font-medium'
                                        )}
                                    >
                                        <span className="truncate">{subItem.label}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent sideOffset={9} className="w-auto min-w-48">
                                        {subItem.childItems.map((leaf) => (
                                            <FlyoutMenuLink
                                                key={leaf.label}
                                                item={leaf}
                                                isActive={isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)}
                                            />
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            ) : (
                                <FlyoutMenuLink
                                    key={subItem.label}
                                    item={subItem}
                                    isActive={isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)}
                                />
                            )
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
};

const SidebarGroupedMenuItems = ({ data, groupLabel, pathname, searchParams, isIconMode, isBranchOpen, setOpenItem }) => {
    return (
        <SidebarGroup>
            {groupLabel && (
                <SidebarGroupLabel className="text-sidebar-foreground/50 tracking-wider uppercase text-[11px] font-semibold">
                    {groupLabel}
                </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {data.map((item) => {
                        const Tag = item.icon ? Icon[item.icon] : null;
                        const isChildActive =
                            item.childItems?.some((subItem) =>
                                isSubGroup(subItem)
                                    ? subItem.childItems.some((leaf) => isLinkActive(leaf.href, leaf.activePath, pathname, searchParams))
                                    : isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)
                            ) ?? false;

                        if (item.childItems && isIconMode) {
                            return (
                                <FlyoutMenuItem
                                    key={item.label}
                                    item={item}
                                    childItems={item.childItems}
                                    isChildActive={isChildActive}
                                    pathname={pathname}
                                    searchParams={searchParams}
                                />
                            );
                        }

                        return item.childItems ? (
                            <Collapsible
                                className="group/collapsible"
                                key={item.label}
                                open={isBranchOpen(item.label)}
                                onOpenChange={(open) => setOpenItem(item.label, open)}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger
                                        render={<SidebarMenuButton tooltip={item.label} isActive={isChildActive} className="data-active:bg-primary/5!" />}
                                    >
                                        {Tag && <Tag />}
                                        <span className={cn('min-w-0 flex-1 truncate', item.badge && 'pr-14')}>{item.label}</span>
                                        {item.badge && (
                                            <SidebarMenuBadge
                                                className={cn('bg-primary/10 max-w-24 truncate rounded-full px-1.5 font-normal', item.badgeClassName)}
                                            >
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-200 data-ending-style:h-0 data-starting-style:h-0">
                                        <SidebarMenuSub>
                                            {item.childItems.map((subItem) =>
                                                isSubGroup(subItem) ? (
                                                    <Collapsible
                                                        className="group/subcollapsible"
                                                        key={subItem.label}
                                                        open={isBranchOpen(subGroupKey(item.label, subItem.label))}
                                                        onOpenChange={(open) => setOpenItem(subGroupKey(item.label, subItem.label), open)}
                                                    >
                                                        <SidebarMenuSubItem>
                                                            <CollapsibleTrigger
                                                                nativeButton={false}
                                                                render={
                                                                    <SidebarMenuSubButton
                                                                        className="data-active:bg-primary/10! justify-between"
                                                                        isActive={subItem.childItems.some((leaf) =>
                                                                            isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)
                                                                        )}
                                                                    />
                                                                }
                                                            >
                                                                {subItem.label}
                                                                <ChevronRightIcon className="ml-auto shrink-0 transition-transform duration-200 group-data-open/subcollapsible:rotate-90" />
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-200 data-ending-style:h-0 data-starting-style:h-0">
                                                                <SidebarMenuSub className="mx-0">
                                                                    {subItem.childItems.map((leaf) => (
                                                                        <SidebarMenuSubItem key={leaf.label}>
                                                                            <SidebarMenuSubButton
                                                                                className="data-active:bg-primary/10! justify-between"
                                                                                render={<Link href={leaf.href} target={leaf.target} />}
                                                                                isActive={isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)}
                                                                            >
                                                                                <span
                                                                                    className={cn(
                                                                                        'min-w-0 flex-1 truncate',
                                                                                        leaf.badge && isExternalLink(leaf.href) && 'pr-8',
                                                                                        leaf.badge && !isExternalLink(leaf.href) && 'pr-14',
                                                                                        !leaf.badge && isExternalLink(leaf.href) && 'pr-6'
                                                                                    )}
                                                                                >
                                                                                    {leaf.label}
                                                                                </span>
                                                                                {leaf.badge && (
                                                                                    <SidebarMenuBadge
                                                                                        className={cn(
                                                                                            'bg-primary/10 max-w-24 truncate rounded-full px-1.5 font-normal',
                                                                                            isExternalLink(leaf.href) && 'right-6',
                                                                                            leaf.badgeClassName
                                                                                        )}
                                                                                    >
                                                                                        {leaf.badge}
                                                                                    </SidebarMenuBadge>
                                                                                )}
                                                                                {isExternalLink(leaf.href) && (
                                                                                    <SquareArrowOutUpRightIcon className="ml-auto size-3.5! shrink-0 opacity-50" />
                                                                                )}
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    ))}
                                                                </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                        </SidebarMenuSubItem>
                                                    </Collapsible>
                                                ) : (
                                                    <SidebarMenuSubItem key={subItem.label}>
                                                        <SidebarMenuSubButton
                                                            className="data-active:bg-primary/10! justify-between"
                                                            render={<Link href={subItem.href} target={subItem.target} />}
                                                            isActive={isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'min-w-0 flex-1 truncate',
                                                                    subItem.badge && isExternalLink(subItem.href) && 'pr-8',
                                                                    subItem.badge && !isExternalLink(subItem.href) && 'pr-14',
                                                                    !subItem.badge && isExternalLink(subItem.href) && 'pr-6'
                                                                )}
                                                            >
                                                                {subItem.label}
                                                            </span>
                                                            {subItem.badge && (
                                                                <SidebarMenuBadge
                                                                    className={cn(
                                                                        'bg-primary/10 max-w-24 truncate rounded-full px-1.5 font-normal',
                                                                        isExternalLink(subItem.href) && 'right-6',
                                                                        subItem.badgeClassName
                                                                    )}
                                                                >
                                                                    {subItem.badge}
                                                                </SidebarMenuBadge>
                                                            )}
                                                            {isExternalLink(subItem.href) && (
                                                                <SquareArrowOutUpRightIcon className="ml-auto size-3.5! shrink-0 opacity-50" />
                                                            )}
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    tooltip={item.label}
                                    render={<Link href={item.href} target={item.target} />}
                                    isActive={pathname === item.href}
                                    className="data-active:bg-primary/10!"
                                >
                                    {Tag && <Tag />}
                                    <span
                                        className={cn(
                                            'min-w-0 flex-1 truncate',
                                            item.badge && isExternalLink(item.href) && 'pr-8',
                                            item.badge && !isExternalLink(item.href) && 'pr-14',
                                            !item.badge && isExternalLink(item.href) && 'pr-6'
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <SidebarMenuBadge
                                            className={cn(
                                                'bg-primary/10 max-w-24 truncate rounded-full px-1.5 font-normal',
                                                isExternalLink(item.href) && 'right-6',
                                                item.badgeClassName
                                            )}
                                        >
                                            {item.badge}
                                        </SidebarMenuBadge>
                                    )}
                                    {isExternalLink(item.href) && (
                                        <SquareArrowOutUpRightIcon className="ml-auto size-3.5! shrink-0 opacity-50" />
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

// Filter Navigation Tree dynamically by Role-Based Access Control (RBAC)
function filterNavByRole(groups, userRole = 'SUPER_ADMIN') {
    return groups
        .filter((g) => !g.roles || g.roles.includes(userRole))
        .map((g) => {
            const filteredItems = g.items
                .filter((item) => !item.roles || item.roles.includes(userRole))
                .map((item) => {
                    if (item.childItems) {
                        const filteredChildren = item.childItems.filter((sub) => !sub.roles || sub.roles.includes(userRole));
                        return { ...item, childItems: filteredChildren };
                    }
                    return item;
                })
                .filter((item) => !item.childItems || item.childItems.length > 0);
            return { ...g, items: filteredItems };
        })
        .filter((g) => g.items.length > 0);
}

const SidebarLayout = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, isMobile } = useSidebar();
    const [externalApps, setExternalApps] = useState([]);
    const [openItems, setOpenItems] = useState({});

    // Active User Role state for Dynamic RBAC Navigation
    const [userRole, setUserRole] = useState('SUPER_ADMIN');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        let mounted = true;
        async function fetchActiveUser() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.profile && mounted) {
                        setUserRole(data.profile.role || 'SUPER_ADMIN');
                        setUserName(data.profile.name || '');
                    }
                }
            } catch {
                // Fallback to SUPER_ADMIN
            }
        }
        fetchActiveUser();

        // Listen for persona/role switch events dispatched across the dashboard
        const handlePersonaChanged = (e) => {
            if (e.detail?.role) {
                setUserRole(e.detail.role);
                setUserName(e.detail.name || '');
            } else {
                fetchActiveUser();
            }
        };

        window.addEventListener('user-persona-changed', handlePersonaChanged);
        return () => {
            mounted = false;
            window.removeEventListener('user-persona-changed', handlePersonaChanged);
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        getNavApps().then((data) => {
            if (!mounted) return;
            setExternalApps(
                data.map((app) => ({
                    icon: app.icon,
                    label: app.name,
                    href: app.href,
                    badge: 'Pro',
                    badgeClassName: 'right-8',
                    ...(app.openInNewTab ? { target: '_self' } : {})
                }))
            );
        });
        return () => {
            mounted = false;
        };
    }, []);

    // Filter Navigation based on Active User Role
    const navGroups = useMemo(() => {
        const baseGroups =
            externalApps.length > 0
                ? navItems.map((item) =>
                      item.groupLabel === 'Apps'
                          ? {
                                ...item,
                                items: item.items.concat(externalApps)
                            }
                          : item
                  )
                : navItems;

        return filterNavByRole(baseGroups, userRole);
    }, [externalApps, userRole]);

    const activeBranchKeys = useMemo(
        () => getActiveBranchKeys(navGroups, pathname, searchParams),
        [navGroups, pathname, searchParams]
    );

    const isBranchOpen = useCallback(
        (key) => openItems[key] ?? activeBranchKeys.has(key),
        [openItems, activeBranchKeys]
    );

    const setOpenItem = useCallback((key, open) => {
        setOpenItems((prev) => ({
            ...prev,
            [key]: open
        }));
    }, []);

    const isIconMode = state === 'collapsed' && !isMobile;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="gap-2.5 bg-transparent! [&>svg]:size-8"
                            render={<Link href={`${themeConfig.homePageUrl}`} />}
                        >
                            <LogoSvg className="[&_rect]:fill-sidebar [&_rect:first-child]:fill-primary" />
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-base font-semibold text-nowrap truncate">{themeConfig.templateName}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                                        {userRole.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
                {navGroups.map((navItem, index) => {
                    return (
                        <SidebarGroupedMenuItems
                            key={navItem.groupLabel || index}
                            data={navItem.items}
                            groupLabel={navItem.groupLabel}
                            pathname={pathname}
                            searchParams={searchParams}
                            isIconMode={isIconMode}
                            isBranchOpen={isBranchOpen}
                            setOpenItem={setOpenItem}
                        />
                    );
                })}
            </SidebarContent>
        </Sidebar>
    );
};

export default SidebarLayout;
