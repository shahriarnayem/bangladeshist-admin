// Third-party Imports
export const navItems = [
    {
        groupLabel: 'Editorial & Content',
        items: [
            {
                icon: 'LayoutDashboard',
                label: 'Executive Desk',
                href: '/dashboard'
            },
            {
                icon: 'FileText',
                label: 'Articles & Stories',
                childItems: [
                    {
                        label: 'All Articles',
                        href: '/dashboard/articles'
                    },
                    {
                        label: 'Write New Article',
                        href: '/dashboard/articles/new'
                    }
                ]
            },
            {
                icon: 'FolderTree',
                label: 'Categories',
                href: '/dashboard/categories'
            },
            {
                icon: 'Tags',
                label: 'Tags',
                href: '/dashboard/tags'
            },
            {
                icon: 'File',
                label: 'Static Pages',
                childItems: [
                    {
                        label: 'All Pages',
                        href: '/dashboard/pages'
                    },
                    {
                        label: 'Create New Page',
                        href: '/dashboard/pages/new'
                    }
                ]
            },
            {
                icon: 'Image',
                label: 'Media Library',
                href: '/dashboard/media'
            }
        ]
    },
    {
        groupLabel: 'Creative Studio',
        items: [
            {
                icon: 'Sparkles',
                label: 'Photocard Studio',
                href: '/dashboard/photocard'
            }
        ]
    },
    {
        groupLabel: 'Community & Audience',
        items: [
            {
                icon: 'MessageSquare',
                label: 'Comments Moderation',
                href: '/dashboard/comments'
            },
            {
                icon: 'HelpCircle',
                label: 'Reader Polls',
                href: '/dashboard/polls'
            },
            {
                icon: 'Users',
                label: 'Staff & Authors',
                childItems: [
                    {
                        label: 'All Staff Members',
                        href: '/dashboard/users'
                    },
                    {
                        label: 'Editorial Byline Profile',
                        href: '/dashboard/profile'
                    }
                ]
            },
            {
                icon: 'TrendingUp',
                label: 'Audience Analytics',
                href: '/dashboard/analytics'
            },
            {
                icon: 'Mail',
                label: 'Newsroom Mail',
                href: '/apps/mail'
            },
            {
                icon: 'Calendar',
                label: 'Publishing Calendar',
                href: '/apps/calendar'
            }
        ]
    },
    {
        groupLabel: 'Growth & Distribution',
        items: [
            {
                icon: 'Search',
                label: 'SEO & IndexNow',
                href: '/dashboard/seo'
            },
            {
                icon: 'ArrowRightLeft',
                label: 'URL Redirects',
                href: '/dashboard/redirects'
            },
            {
                icon: 'Megaphone',
                label: 'Ad Placements',
                href: '/dashboard/ads'
            }
        ]
    },
    {
        groupLabel: 'Site Configuration',
        items: [
            {
                icon: 'LayoutTemplate',
                label: 'Homepage Builder',
                href: '/dashboard/homepage-builder'
            },
            {
                icon: 'PanelsTopLeft',
                label: 'Header Builder',
                href: '/dashboard/header-builder'
            },
            {
                icon: 'PanelBottom',
                label: 'Footer Builder',
                href: '/dashboard/footer-builder'
            },
            {
                icon: 'Menu',
                label: 'Menu Builder',
                href: '/dashboard/menu-builder'
            },
            {
                icon: 'Plug',
                label: 'Integrations',
                href: '/dashboard/integrations'
            },
            {
                icon: 'Palette',
                label: 'Theme & Appearance',
                href: '/dashboard/appearance'
            },
            {
                icon: 'Settings',
                label: 'CMS Settings',
                href: '/dashboard/settings'
            },
            {
                icon: 'ScrollText',
                label: 'Audit Logs',
                href: '/dashboard/audit'
            },
            {
                icon: 'Terminal',
                label: 'System Logs',
                href: '/dashboard/logs'
            },
            {
                icon: 'Database',
                label: 'Backup & Export',
                href: '/dashboard/backup'
            }
        ]
    }
];
