// Navigation configuration with Role-Based Access Control (RBAC)
// Supported roles: SUPER_ADMIN, ADMIN, EDITOR, AUTHOR, SEO_MANAGER, READER

export const ALL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'SEO_MANAGER', 'READER'];
export const EDITORIAL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'];
export const MANAGEMENT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
export const ADMIN_ONLY_ROLES = ['SUPER_ADMIN', 'ADMIN'];

export const navItems = [
    {
        groupLabel: 'Editorial & Content',
        roles: ALL_ROLES,
        items: [
            {
                icon: 'LayoutDashboard',
                label: 'Executive Desk',
                href: '/dashboard',
                roles: ALL_ROLES
            },
            {
                icon: 'FileText',
                label: 'Articles & Stories',
                roles: EDITORIAL_ROLES,
                childItems: [
                    {
                        label: 'All Articles',
                        href: '/dashboard/articles',
                        roles: EDITORIAL_ROLES
                    },
                    {
                        label: 'Write New Article',
                        href: '/dashboard/articles/new',
                        roles: EDITORIAL_ROLES
                    }
                ]
            },
            {
                icon: 'FolderTree',
                label: 'Categories',
                href: '/dashboard/categories',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'Tags',
                label: 'Tags',
                href: '/dashboard/tags',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'File',
                label: 'Static Pages',
                roles: MANAGEMENT_ROLES,
                childItems: [
                    {
                        label: 'All Pages',
                        href: '/dashboard/pages',
                        roles: MANAGEMENT_ROLES
                    },
                    {
                        label: 'Create New Page',
                        href: '/dashboard/pages/new',
                        roles: MANAGEMENT_ROLES
                    }
                ]
            },
            {
                icon: 'Image',
                label: 'Media Library',
                href: '/dashboard/media',
                roles: EDITORIAL_ROLES
            }
        ]
    },
    {
        groupLabel: 'Creative Studio',
        roles: EDITORIAL_ROLES,
        items: [
            {
                icon: 'Sparkles',
                label: 'Photocard Studio',
                href: '/dashboard/photocard',
                roles: EDITORIAL_ROLES
            }
        ]
    },
    {
        groupLabel: 'Community & Audience',
        roles: ALL_ROLES,
        items: [
            {
                icon: 'MessageSquare',
                label: 'Comments Moderation',
                href: '/dashboard/comments',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'HelpCircle',
                label: 'Reader Polls',
                href: '/dashboard/polls',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'Users',
                label: 'Staff & Authors',
                roles: ALL_ROLES,
                childItems: [
                    {
                        label: 'All Staff Members',
                        href: '/dashboard/users',
                        roles: ADMIN_ONLY_ROLES
                    },
                    {
                        label: 'Staff Profile Settings',
                        href: '/dashboard/profile',
                        roles: ALL_ROLES
                    }
                ]
            },
            {
                icon: 'TrendingUp',
                label: 'Audience Analytics',
                href: '/dashboard/analytics',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'Mail',
                label: 'Newsroom Mail',
                href: '/apps/mail',
                roles: MANAGEMENT_ROLES
            },
            {
                icon: 'Calendar',
                label: 'Publishing Calendar',
                href: '/apps/calendar',
                roles: EDITORIAL_ROLES
            }
        ]
    },
    {
        groupLabel: 'Growth & Distribution',
        roles: ['SUPER_ADMIN', 'ADMIN', 'SEO_MANAGER'],
        items: [
            {
                icon: 'Search',
                label: 'SEO & IndexNow',
                href: '/dashboard/seo',
                roles: ['SUPER_ADMIN', 'ADMIN', 'SEO_MANAGER']
            },
            {
                icon: 'ArrowRightLeft',
                label: 'URL Redirects',
                href: '/dashboard/redirects',
                roles: ['SUPER_ADMIN', 'ADMIN', 'SEO_MANAGER']
            },
            {
                icon: 'Megaphone',
                label: 'Ad Placements',
                href: '/dashboard/ads',
                roles: ADMIN_ONLY_ROLES
            }
        ]
    },
    {
        groupLabel: 'Site Configuration',
        roles: ADMIN_ONLY_ROLES,
        items: [
            {
                icon: 'LayoutTemplate',
                label: 'Homepage Builder',
                href: '/dashboard/homepage-builder',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'PanelsTopLeft',
                label: 'Header Builder',
                href: '/dashboard/header-builder',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'PanelBottom',
                label: 'Footer Builder',
                href: '/dashboard/footer-builder',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Menu',
                label: 'Menu Builder',
                href: '/dashboard/menu-builder',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Plug',
                label: 'Integrations',
                href: '/dashboard/integrations',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Palette',
                label: 'Theme & Appearance',
                href: '/dashboard/appearance',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Settings',
                label: 'CMS Settings',
                href: '/dashboard/settings',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'ScrollText',
                label: 'Audit Logs',
                href: '/dashboard/audit',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Terminal',
                label: 'System Logs',
                href: '/dashboard/logs',
                roles: ADMIN_ONLY_ROLES
            },
            {
                icon: 'Database',
                label: 'Backup & Export',
                href: '/dashboard/backup',
                roles: ADMIN_ONLY_ROLES
            }
        ]
    }
];
