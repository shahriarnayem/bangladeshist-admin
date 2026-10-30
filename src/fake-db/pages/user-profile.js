export const db = {
    // About Section - Profile Section Data
    profileSections: [
        {
            title: 'About',
            items: [
                {
                    iconKey: 'UserIcon',
                    label: 'Full Name',
                    value: 'Rafiqul Islam'
                },
                {
                    iconKey: 'CheckCheckIcon',
                    label: 'Status',
                    value: 'Active'
                },
                {
                    iconKey: 'StarIcon',
                    label: 'Role',
                    value: 'Chief Editor'
                },
                {
                    iconKey: 'FlagIcon',
                    label: 'Country',
                    value: 'Global'
                },
                {
                    iconKey: 'LanguagesIcon',
                    label: 'Languages',
                    value: 'বাংলা, English'
                }
            ]
        },
        {
            title: 'Contacts',
            items: [
                {
                    iconKey: 'PhoneIcon',
                    label: 'Contact',
                    value: '+880 1711-200001'
                },
                {
                    iconKey: 'MessagesSquareIcon',
                    label: 'Telegram',
                    value: '@rafiq_bd_edit'
                },
                {
                    iconKey: 'MailIcon',
                    label: 'Email',
                    value: 'editor@thechronicle.press'
                }
            ]
        },
        {
            title: 'Desks',
            items: [
                {
                    label: 'National Affairs',
                    value: '(14 Reporters)'
                },
                {
                    label: 'Investigative Unit',
                    value: '(6 Members)'
                }
            ]
        }
    ],
    overviewSections: [
        {
            title: 'Overview',
            items: [
                {
                    iconKey: 'CheckIcon',
                    label: 'Stories Published',
                    value: '1,428'
                },
                {
                    iconKey: 'UserIcon',
                    label: 'Newsletter Subscribers',
                    value: '38.4k'
                },
                {
                    iconKey: 'LayoutGridIcon',
                    label: 'Series Completed',
                    value: '48'
                }
            ]
        }
    ],
    // Activity Timeline - Profile Section Data
    activityLog: [
        {
            id: 1,
            description: 'NRB Diaspora Series — 6 articles published',
            timestamp: '12 min ago',
            detail: 'All six parts of the NRB special series are now live on thechronicle.press.',
            attachment: {
                name: 'editorial-report.pdf',
                fileType: 'pdf'
            }
        },
        {
            id: 2,
            description: 'Weekly Editorial Sync',
            timestamp: '45 min ago',
            detail: 'Weekly editorial planning with desk leads @10:15am BST',
            person: {
                name: 'Mahmudul Hasan (Publisher)',
                initials: 'MH',
                role: 'Publisher, The Chronicle',
                avatar: '/images/avatars/avatar-3.webp'
            }
        },
        {
            id: 3,
            description: 'New investigative series assigned',
            timestamp: '2 Day Ago',
            detail: '6 reporters assigned to Garment Sector accountability series',
            teamMembers: [
                {
                    name: 'Tahmina Begum',
                    initials: 'TB',
                    avatar: '/images/avatars/avatar-1.webp'
                },
                {
                    name: 'Nusrat Jahan',
                    initials: 'NJ',
                    avatar: '/images/avatars/avatar-2.webp'
                },
                {
                    name: 'Karim Uddin',
                    initials: 'KU',
                    avatar: '/images/avatars/avatar-4.webp'
                }
            ],
            teamExtraCount: 3
        }
    ],
    // Project - Profile Section Data
    projectDatatable: [
        {
            id: 'upp-001',
            name: 'NRB Diaspora Series 2026',
            type: 'Investigative Series',
            logo: '/images/brands/figma-icon.webp',
            logoDark: '/images/brands/figma-icon.webp',
            leader: 'Tahmina Begum',
            team: [
                {
                    avatar: '/images/avatars/avatar-1.webp',
                    initials: 'TB'
                },
                {
                    avatar: '/images/avatars/avatar-3.webp',
                    initials: 'NJ'
                }
            ],
            teamExtraCount: 2,
            progress: 82,
            updatedAt: 'Updated 2 days ago'
        },
        {
            id: 'upp-002',
            name: 'Audience Analytics Dashboard',
            type: 'Digital Project',
            logo: '/images/brands/next-logo.webp',
            logoDark: '/images/brands/next-logo-dark.webp',
            leader: 'Karim Uddin',
            team: [
                {
                    avatar: '/images/avatars/avatar-2.webp',
                    initials: 'KU'
                },
                {
                    avatar: '/images/avatars/avatar-4.webp',
                    initials: 'SA'
                }
            ],
            teamExtraCount: 1,
            progress: 64,
            updatedAt: 'Updated 5 days ago'
        },
        {
            id: 'upp-003',
            name: 'CMS Redesign — The Chronicle',
            type: 'Tech Project',
            logo: '/images/brands/shadcn-logo.webp',
            logoDark: '/images/brands/shadcn-logo.webp',
            leader: 'Shabnam Akter',
            team: [
                {
                    avatar: '/images/avatars/avatar-5.webp',
                    initials: 'SA'
                },
                {
                    initials: 'FI'
                }
            ],
            teamExtraCount: 3,
            progress: 47,
            updatedAt: 'Updated 1 day ago'
        },
        {
            id: 'upp-004',
            name: 'Garment Sector Investigation',
            type: 'Investigative Series',
            logo: '/images/brands/laravel-logo.webp',
            logoDark: '/images/brands/laravel-logo.webp',
            leader: 'Nusrat Jahan',
            team: [
                {
                    avatar: '/images/avatars/avatar-7.webp',
                    initials: 'NJ'
                },
                {
                    avatar: '/images/avatars/avatar-8.webp',
                    initials: 'KU'
                },
                {
                    initials: 'RA'
                }
            ],
            teamExtraCount: 2,
            progress: 91,
            updatedAt: 'Updated 3 days ago'
        },
        {
            id: 'upp-005',
            name: 'Newsletter Platform Upgrade',
            type: 'Digital Project',
            logo: '/images/brands/mcp-icon.webp',
            logoDark: '/images/brands/mcp-icon-dark.webp',
            leader: 'Farhana Islam',
            team: [
                {
                    avatar: '/images/avatars/avatar-9.webp',
                    initials: 'FI'
                },
                {
                    avatar: '/images/avatars/avatar-10.webp',
                    initials: 'MH'
                }
            ],
            teamExtraCount: 1,
            progress: 58,
            updatedAt: 'Updated 6 days ago'
        },
        {
            id: 'upp-006',
            name: 'Victory Day Special Edition',
            type: 'Editorial Project',
            logo: '/images/brands/react-logo.webp',
            logoDark: '/images/brands/react-logo.webp',
            leader: 'Mahmudul Hasan',
            team: [
                {
                    avatar: '/images/avatars/avatar-11.webp',
                    initials: 'MH'
                },
                {
                    avatar: '/images/avatars/avatar-12.webp',
                    initials: 'TB'
                }
            ],
            teamExtraCount: 4,
            progress: 36,
            updatedAt: 'Updated 4 days ago'
        },
        {
            id: 'upp-007',
            name: 'Ad Revenue Billing System',
            type: 'Finance Project',
            logo: '/images/brands/mcp-icon.webp',
            logoDark: '/images/brands/mcp-icon-dark.webp',
            leader: 'Shabnam Akter',
            team: [
                {
                    avatar: '/images/avatars/avatar-1.webp',
                    initials: 'SA'
                },
                {
                    avatar: '/images/avatars/avatar-6.webp',
                    initials: 'KU'
                },
                {
                    initials: 'NJ'
                }
            ],
            teamExtraCount: 0,
            progress: 73,
            updatedAt: 'Updated 7 days ago'
        },
        {
            id: 'upp-008',
            name: 'Reader Support Desk Setup',
            type: 'Operations Project',
            logo: '/images/brands/next-logo.webp',
            logoDark: '/images/brands/next-logo-dark.webp',
            leader: 'Karim Uddin',
            team: [
                {
                    avatar: '/images/avatars/avatar-3.webp',
                    initials: 'KU'
                },
                {
                    avatar: '/images/avatars/avatar-8.webp',
                    initials: 'FI'
                },
                {
                    initials: 'RI'
                }
            ],
            teamExtraCount: 0,
            progress: 69,
            updatedAt: 'Updated 8 days ago'
        },
        {
            id: 'upp-009',
            name: 'The Chronicle Knowledge Base',
            type: 'Editorial Project',
            logo: '/images/brands/github-icon.webp',
            logoDark: '/images/brands/github-white.webp',
            leader: 'Nusrat Jahan',
            team: [
                {
                    avatar: '/images/avatars/avatar-4.webp',
                    initials: 'NJ'
                },
                {
                    avatar: '/images/avatars/avatar-9.webp',
                    initials: 'TB'
                }
            ],
            teamExtraCount: 3,
            progress: 54,
            updatedAt: 'Updated 10 days ago'
        },
        {
            id: 'upp-010',
            name: 'Brand Identity Refresh',
            type: 'Design Project',
            logo: '/images/brands/figma-icon.webp',
            logoDark: '/images/brands/figma-icon.webp',
            leader: 'Farhana Islam',
            team: [
                {
                    avatar: '/images/avatars/avatar-2.webp',
                    initials: 'FI'
                },
                {
                    avatar: '/images/avatars/avatar-5.webp',
                    initials: 'SA'
                },
                {
                    initials: 'MH'
                }
            ],
            teamExtraCount: 2,
            progress: 88,
            updatedAt: 'Updated 12 days ago'
        }
    ],
    // Connections - Profile Section Data
    connectionActions: [
        'Share',
        'Suggest Edits',
        'Report Issue'
    ],
    connections: [
        {
            id: 1,
            name: 'Tahmina Begum',
            initials: 'TB',
            avatar: '/images/avatars/avatar-1.webp',
            totalConnections: '45 Connections',
            isConnected: false
        },
        {
            id: 2,
            name: 'Nusrat Jahan',
            initials: 'NJ',
            avatar: '/images/avatars/avatar-2.webp',
            totalConnections: '1.32k Connections',
            isConnected: true
        },
        {
            id: 3,
            name: 'Karim Uddin',
            initials: 'KU',
            avatar: '/images/avatars/avatar-3.webp',
            totalConnections: '125 Connections',
            isConnected: true
        },
        {
            id: 4,
            name: 'Shabnam Akter',
            initials: 'SA',
            avatar: '/images/avatars/avatar-4.webp',
            totalConnections: '456 Connections',
            isConnected: false
        },
        {
            id: 5,
            name: 'Farhana Islam',
            initials: 'FI',
            avatar: '/images/avatars/avatar-5.webp',
            totalConnections: '1.2k Connections',
            isConnected: false
        }
    ],
    // Connections Card - Connection Section Data
    connectionCardActions: [
        'Share Connection',
        'Block Connection',
        'Delete'
    ],
    connectionCards: [
        {
            id: 1,
            name: 'Rafiqul Islam',
            role: 'Chief Editor',
            initials: 'RI',
            avatar: '/images/avatars/avatar-1.webp',
            tags: [
                {
                    label: 'National Affairs'
                },
                {
                    label: 'Investigations'
                }
            ],
            stats: {
                projects: '18',
                tasks: '834',
                connections: '129'
            },
            totalConnections: '129 Connections',
            isConnected: true
        },
        {
            id: 2,
            name: 'Tahmina Begum',
            role: 'Senior Reporter',
            initials: 'TB',
            avatar: '/images/avatars/avatar-2.webp',
            tags: [
                {
                    label: 'Business'
                },
                {
                    label: 'Economy'
                }
            ],
            stats: {
                projects: '112',
                tasks: '2.31k',
                connections: '1.28k'
            },
            totalConnections: '1.28k Connections',
            isConnected: false
        },
        {
            id: 3,
            name: 'Karim Uddin',
            role: 'Correspondent',
            initials: 'KU',
            avatar: '/images/avatars/avatar-3.webp',
            tags: [
                {
                    label: 'Politics'
                },
                {
                    label: 'Analysis'
                }
            ],
            stats: {
                projects: '32',
                tasks: '1.25k',
                connections: '890'
            },
            totalConnections: '890 Connections',
            isConnected: false
        },
        {
            id: 4,
            name: 'Nusrat Jahan',
            role: 'Features Editor',
            initials: 'NJ',
            avatar: '/images/avatars/avatar-4.webp',
            tags: [
                {
                    label: 'Life & Culture'
                },
                {
                    label: 'Opinion'
                },
                {
                    label: 'Social'
                }
            ],
            stats: {
                projects: '86',
                tasks: '12.4k',
                connections: '890'
            },
            totalConnections: '890 Connections',
            isConnected: false
        },
        {
            id: 5,
            name: 'Shabnam Akter',
            role: 'Partnerships Lead',
            initials: 'SA',
            avatar: '/images/avatars/avatar-5.webp',
            tags: [
                {
                    label: 'Monetisation'
                },
                {
                    label: 'Brand Deals'
                },
                {
                    label: 'Growth'
                }
            ],
            stats: {
                projects: '244',
                tasks: '23.8k',
                connections: '2.14k'
            },
            totalConnections: '2.14k Connections',
            isConnected: true
        },
        {
            id: 6,
            name: 'Farhana Islam',
            role: 'Newsletter Editor',
            initials: 'FI',
            avatar: '/images/avatars/avatar-6.webp',
            tags: [
                {
                    label: 'Newsletter'
                },
                {
                    label: 'Audience'
                }
            ],
            stats: {
                projects: '32',
                tasks: '1.28k',
                connections: '1.27k'
            },
            totalConnections: '1.27k Connections',
            isConnected: false
        }
    ],
    // Team - Profile Section Data
    teamActions: [
        'Share Desk',
        'Suggest Edits',
        'Report Issue'
    ],
    teams: [
        {
            id: 1,
            teams: 'National Affairs Desk',
            initials: 'NA',
            avatar: '/images/avatars/avatar-1.webp',
            totalMembers: '14 Members',
            teamBadge: {
                label: 'Reporter'
            }
        },
        {
            id: 2,
            teams: 'Investigative Unit',
            initials: 'IU',
            avatar: '/images/avatars/avatar-2.webp',
            totalMembers: '6 Members',
            teamBadge: {
                label: 'Investigative'
            }
        },
        {
            id: 3,
            teams: 'NRB Diaspora Desk',
            initials: 'NR',
            avatar: '/images/avatars/avatar-3.webp',
            totalMembers: '8 Members',
            teamBadge: {
                label: 'Correspondent'
            }
        },
        {
            id: 4,
            teams: 'Digital & Social',
            initials: 'DS',
            avatar: '/images/avatars/avatar-4.webp',
            totalMembers: '10 Members',
            teamBadge: {
                label: 'Digital'
            }
        },
        {
            id: 5,
            teams: 'Newsletter & Audience',
            initials: 'NL',
            avatar: '/images/avatars/avatar-2.webp',
            totalMembers: '5 Members',
            teamBadge: {
                label: 'Newsletter'
            }
        }
    ]
};
