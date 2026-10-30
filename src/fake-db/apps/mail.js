// Third-party Imports
import { subDays, subHours, subWeeks } from 'date-fns';
// Config Imports
import { MAIL_CURRENT_USER } from '@/configs/mailConfig';
const now = new Date();
const hoursAgo = (hours)=>subHours(now, hours);
const daysAgo = (days)=>subDays(now, days);
const weeksAgo = (weeks)=>subWeeks(now, weeks);
export const db = [
    {
        id: '1',
        from: 'Tahmina Begum',
        fromEmail: 'tahmina.begum@thechronicle.press',
        avatar: '/images/avatars/avatar-3.webp?seed=Tahmina',
        subject: 'Story Pitch: Garment Sector Worker Conditions — Geneva Report',
        preview: "Thanks for the feedback — I'll incorporate your edits into the final draft before the evening edition.",
        body: "Thanks for the feedback — I'll incorporate your edits into the final draft before the evening edition.\n\nLet's sync on Monday to finalize the photography selection.\n\nBest,\nTahmina",
        date: hoursAgo(2),
        isRead: true,
        isStarred: false,
        labels: [
            'updates'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '1-1',
                    from: 'Tahmina Begum',
                    fromEmail: 'tahmina.begum@thechronicle.press',
                    body: "Hi Editorial Desk,\n\nI wanted to share the latest readership metrics from our Garment Sector series. We've seen a 38% increase in engagement compared to last month, which is excellent!\n\nKey highlights:\n- Article open rate: 44%\n- Social shares: 2,100+\n- Average read time: 5m 12s\n\nLet's schedule a meeting next week to discuss the next investigative piece.\n\nBest regards,\nTahmina",
                    date: daysAgo(3)
                },
                {
                    id: '1-2',
                    from: MAIL_CURRENT_USER.name,
                    fromEmail: MAIL_CURRENT_USER.email,
                    body: "Hi Tahmina,\n\nGreat numbers! The read-time improvement is especially impressive — readers are spending more time on long-form pieces.\n\nI'd suggest we follow up with a human interest angle on the supervisors. Can you share the top-performing paragraph hooks?\n\nThanks,\nEditorial Desk",
                    date: daysAgo(2),
                    isFromMe: true
                },
                {
                    id: '1-3',
                    from: 'Tahmina Begum',
                    fromEmail: 'tahmina.begum@thechronicle.press',
                    body: 'Absolutely! Here are the top 3 opening hooks:\n\n1. "At 4 AM, the factory lights never go off…" — 51% read-through\n2. "She has sewn 10,000 shirts and never owned one." — 48% read-through\n3. "Global ships 40% of the world\'s RMG — meet the people behind the label." — 45% read-through\n\nI\'ll prepare a detailed breakdown for our Monday meeting.\n\nTahmina',
                    date: daysAgo(1)
                },
                {
                    id: '1-4',
                    from: 'Tahmina Begum',
                    fromEmail: 'tahmina.begum@thechronicle.press',
                    body: "Thanks for the feedback — I'll incorporate your edits into the final draft before the evening edition.\n\nLet's sync on Monday to finalize the photography selection.\n\nBest,\nTahmina",
                    date: hoursAgo(2)
                }
            ]
        }
    },
    {
        id: '2',
        from: 'Rafiq Hossain',
        fromEmail: 'rafiq.hossain@thechronicle.press',
        avatar: '/images/avatars/avatar-4.webp?seed=Rafiq',
        subject: 'Editorial Calendar — Q4 2026 Planning Update',
        preview: 'Hello, Just a quick update on the editorial calendar for Q4. We are on track for the special Independence Day edition...',
        body: "Hello,\n\nJust a quick update on the editorial calendar for Q4. We're currently on track for the Independence Day special edition and the NRB Diaspora series.\n\nNext steps:\n1. Finalize story assignments for November\n2. Coordinate with photo desk\n3. Review advertiser commitments\n\nPlease let me know if you have any concerns.\n\nThanks,\nRafiq",
        date: hoursAgo(5),
        isRead: true,
        isStarred: true,
        labels: [
            'updates'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '2-1',
                    from: 'Rafiq Hossain',
                    fromEmail: 'rafiq.hossain@thechronicle.press',
                    body: "Hello,\n\nJust a quick update on the editorial calendar for Q4. We're currently on track for the Independence Day special edition and the NRB Diaspora series.\n\nNext steps:\n1. Finalize story assignments for November\n2. Coordinate with photo desk\n3. Review advertiser commitments\n\nPlease let me know if you have any concerns.\n\nThanks,\nRafiq",
                    date: hoursAgo(5)
                }
            ]
        }
    },
    {
        id: '3',
        from: 'Nusrat Jahan',
        fromEmail: 'nusrat.jahan@thechronicle.press',
        avatar: '/images/avatars/avatar-6.webp?seed=Nusrat',
        subject: 'Re: Editorial Lunch — Story Brainstorm Session',
        preview: 'Perfect — see you at 12:30 at the press club canteen!',
        body: 'Perfect — see you at 12:30 at the press club canteen!\n\nNusrat',
        date: daysAgo(1),
        isRead: false,
        isStarred: false,
        labels: [
            'social'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '3-1',
                    from: 'Karim Uddin',
                    fromEmail: 'karim.uddin@thechronicle.press',
                    body: "Hey team,\n\nWho's up for a lunch brainstorm tomorrow? I was thinking the press club canteen — good acoustics for a noisy newsroom escape.\n\nLet me know!\nKarim",
                    date: daysAgo(2)
                },
                {
                    id: '3-2',
                    from: 'Nusrat Jahan',
                    fromEmail: 'nusrat.jahan@thechronicle.press',
                    body: "Count me in! What time are we meeting?\n\nI'm flexible after 12:30 PM. Looking forward to pitching the Chittagong Port story!\n\nNusrat",
                    date: daysAgo(1)
                },
                {
                    id: '3-3',
                    from: 'Nusrat Jahan',
                    fromEmail: 'nusrat.jahan@thechronicle.press',
                    body: 'Perfect — see you at 12:30 at the press club canteen!\n\nNusrat',
                    date: daysAgo(1)
                }
            ]
        }
    },
    {
        id: '4',
        from: 'Karim Uddin',
        fromEmail: 'karim.uddin@thechronicle.press',
        subject: 'Fact-Check Request — Flood Relief Fund Story',
        preview: 'Hi, Could you review the fact-check for the flood relief fund investigation before we publish?',
        body: "Hi,\n\nCould you review the fact-check for the flood relief fund investigation? I've cross-referenced 4 government sources and 2 NGO reports.\n\nDraft link: internal.thechronicle.press/drafts/flood-relief-2026\n\nThanks!\nKarim",
        date: daysAgo(1),
        isRead: false,
        isStarred: false,
        labels: [
            'forums'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '4-1',
                    from: 'Karim Uddin',
                    fromEmail: 'karim.uddin@thechronicle.press',
                    body: "Hi,\n\nCould you review the fact-check for the flood relief fund investigation? I've cross-referenced 4 government sources and 2 NGO reports.\n\nDraft link: internal.thechronicle.press/drafts/flood-relief-2026\n\nThanks!\nKarim",
                    date: daysAgo(1)
                }
            ]
        }
    },
    {
        id: '5',
        from: MAIL_CURRENT_USER.name,
        fromEmail: MAIL_CURRENT_USER.email,
        to: 'Content Team',
        toEmail: 'content@thechronicle.press',
        subject: 'Editorial Sync Notes — Weekly Story Planning',
        preview: "Here are the notes from today's weekly editorial sync...",
        body: "Here are the notes from today's weekly editorial sync:\n\n- Assigned breaking news coverage: Geneva by-election\n- Confirmed NRB Diaspora special series dates\n- Next editorial meeting: Friday 3 PM BST\n\nAction items:\n- Submit draft headlines by Thursday\n- Coordinate with photo desk for field assignments\n\nBest,\nEditorial Desk",
        date: daysAgo(2),
        isRead: true,
        isStarred: true,
        labels: [],
        status: 'sent',
        thread: {
            messages: [
                {
                    id: '5-1',
                    from: MAIL_CURRENT_USER.name,
                    fromEmail: MAIL_CURRENT_USER.email,
                    body: "Here are the notes from today's weekly editorial sync:\n\n- Assigned breaking news coverage: Geneva by-election\n- Confirmed NRB Diaspora special series dates\n- Next editorial meeting: Friday 3 PM BST\n\nAction items:\n- Submit draft headlines by Thursday\n- Coordinate with photo desk for field assignments\n\nBest,\nEditorial Desk",
                    date: daysAgo(2),
                    isFromMe: true
                }
            ]
        }
    },
    {
        id: '6',
        from: 'Shabnam Akter',
        fromEmail: 'shabnam.akter@thechronicle.press',
        subject: 'Sponsored Content Approval — Brand Partnership Q4',
        preview: 'Hi, I need approval for the sponsored content slots for Q4 brand partnerships...',
        body: 'Hi,\n\nI need approval for the sponsored content slots for Q4 brand partnerships. The projected reader reach is 420k based on Q3 performance.\n\nDetailed breakdown:\n- Sponsored editorial: ৳ 1,20,000\n- Newsletter placement: ৳ 85,000\n- Social media series: ৳ 65,000\n\nTotal: ৳ 2,70,000\n\nPlease review the attached proposal and let me know if you have any questions.\n\nBest regards,\nShabnam',
        date: daysAgo(3),
        isRead: true,
        isStarred: true,
        labels: [
            'updates'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '6-1',
                    from: 'Shabnam Akter',
                    fromEmail: 'shabnam.akter@thechronicle.press',
                    body: 'Hi,\n\nI need approval for the sponsored content slots for Q4 brand partnerships. The projected reader reach is 420k based on Q3 performance.\n\nDetailed breakdown:\n- Sponsored editorial: ৳ 1,20,000\n- Newsletter placement: ৳ 85,000\n- Social media series: ৳ 65,000\n\nTotal: ৳ 2,70,000\n\nPlease review the attached proposal and let me know if you have any questions.\n\nBest regards,\nShabnam',
                    date: daysAgo(3)
                }
            ]
        }
    },
    {
        id: '7',
        from: 'IT Operations',
        fromEmail: 'itsupport@thechronicle.press',
        avatar: '/images/avatars/avatar-7.webp?seed=IT',
        subject: 'CMS Server Maintenance — Saturday 2 AM–6 AM BST',
        preview: 'Scheduled maintenance this Saturday from 2 AM to 6 AM BST...',
        body: 'Scheduled maintenance this Saturday from 2 AM to 6 AM BST.\n\nWhat to expect:\n- Brief CMS access interruptions\n- Database optimisation\n- Security patches applied\n\nAll services will be fully restored by 6 AM BST.\n\nIT Operations\nThe Chronicle Media',
        date: daysAgo(4),
        isRead: true,
        isStarred: false,
        labels: [
            'updates'
        ],
        status: 'archive',
        thread: {
            messages: [
                {
                    id: '7-1',
                    from: 'IT Operations',
                    fromEmail: 'itsupport@thechronicle.press',
                    body: 'Scheduled maintenance this Saturday from 2 AM to 6 AM BST.\n\nWhat to expect:\n- Brief CMS access interruptions\n- Database optimisation\n- Security patches applied\n\nAll services will be fully restored by 6 AM BST.\n\nIT Operations\nThe Chronicle Media',
                    date: daysAgo(4)
                }
            ]
        }
    },
    {
        id: '8',
        from: 'Farhana Islam',
        fromEmail: 'farhana.islam@thechronicle.press',
        avatar: '/images/avatars/avatar-8.webp?seed=Farhana',
        subject: 'Team Iftar & Strategy Dinner — Annual Editorial Retreat',
        preview: 'Excited to announce our annual editorial retreat and strategy session!',
        body: 'Excited to announce our annual editorial retreat and strategy session!\n\nDate: December 20, 2026\nTime: 6 PM – 10 PM BST\nLocation: Geneva Press Club, Motijheel\n\nAgenda:\n- Editorial highlights 2026\n- Strategy for 2027\n- Team recognition awards\n\nPlease RSVP by December 13.\n\nLooking forward to seeing everyone there!\n\nFarhana',
        date: weeksAgo(1),
        isRead: false,
        isStarred: false,
        labels: [
            'social'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '8-1',
                    from: 'Farhana Islam',
                    fromEmail: 'farhana.islam@thechronicle.press',
                    body: 'Excited to announce our annual editorial retreat and strategy session!\n\nDate: December 20, 2026\nTime: 6 PM – 10 PM BST\nLocation: Geneva Press Club, Motijheel\n\nAgenda:\n- Editorial highlights 2026\n- Strategy for 2027\n- Team recognition awards\n\nPlease RSVP by December 13.\n\nLooking forward to seeing everyone there!\n\nFarhana',
                    date: weeksAgo(1)
                }
            ]
        }
    },
    {
        id: '9',
        from: MAIL_CURRENT_USER.name,
        fromEmail: MAIL_CURRENT_USER.email,
        to: 'Mahmudul Hasan',
        toEmail: 'mahmudul.hasan@thechronicle.press',
        subject: 'Contributor Performance Review — October 2026',
        preview: 'Thank you for the detailed contributor performance review...',
        body: "Thank you for the detailed contributor performance review.\n\nI appreciate the constructive feedback and agree with the areas identified for improvement. I've already started working on deepening source networks in Sylhet division and will continue to focus on cross-desk collaboration with the video team.\n\nLooking forward to our quarterly check-in.\n\nBest,\nEditorial Desk",
        date: weeksAgo(1),
        isRead: true,
        isStarred: false,
        labels: [],
        status: 'sent',
        thread: {
            messages: [
                {
                    id: '9-1',
                    from: MAIL_CURRENT_USER.name,
                    fromEmail: MAIL_CURRENT_USER.email,
                    body: "Thank you for the detailed contributor performance review.\n\nI appreciate the constructive feedback and agree with the areas identified for improvement. I've already started working on deepening source networks in Sylhet division and will continue to focus on cross-desk collaboration with the video team.\n\nLooking forward to our quarterly check-in.\n\nBest,\nEditorial Desk",
                    date: weeksAgo(1),
                    isFromMe: true
                }
            ]
        }
    },
    {
        id: '10',
        from: MAIL_CURRENT_USER.name,
        fromEmail: MAIL_CURRENT_USER.email,
        subject: 'Draft: Year-End Editorial Report 2026',
        preview: 'Working on the year-end editorial report draft...',
        body: 'Working on the year-end editorial report draft.\n\nWill share it with the senior team by end of day for review.\n\n[Draft incomplete — save for later]',
        date: daysAgo(2),
        isRead: true,
        isStarred: false,
        labels: [],
        status: 'drafts',
        thread: {
            messages: [
                {
                    id: '10-1',
                    from: MAIL_CURRENT_USER.name,
                    fromEmail: MAIL_CURRENT_USER.email,
                    body: 'Working on the year-end editorial report draft.\n\nWill share it with the senior team by end of day for review.\n\n[Draft incomplete — save for later]',
                    date: daysAgo(2),
                    isFromMe: true
                }
            ]
        }
    },
    {
        id: '11',
        from: 'CMS System',
        fromEmail: 'noreply@thechronicle.press',
        avatar: '/images/avatars/avatar-10.webp?seed=System',
        subject: 'Password Reset — The Chronicle CMS',
        preview: 'Your CMS password was successfully reset...',
        body: 'Your CMS password was successfully reset on October 29, 2026 at 3:45 PM BST.\n\nIf you did not make this change, please contact IT support immediately at itsupport@thechronicle.press.\n\nBest regards,\nThe Chronicle CMS System',
        date: daysAgo(2),
        isRead: true,
        isStarred: false,
        labels: [],
        status: 'trash',
        thread: {
            messages: [
                {
                    id: '11-1',
                    from: 'CMS System',
                    fromEmail: 'noreply@thechronicle.press',
                    body: 'Your CMS password was successfully reset on October 29, 2026 at 3:45 PM BST.\n\nIf you did not make this change, please contact IT support immediately at itsupport@thechronicle.press.\n\nBest regards,\nThe Chronicle CMS System',
                    date: daysAgo(2)
                }
            ]
        }
    },
    {
        id: '12',
        from: 'Editorial Newsletter Team',
        fromEmail: 'newsletter@thechronicle.press',
        subject: 'The Chronicle Weekly — October 2026 Edition',
        preview: 'Check out this week\'s top stories from The Chronicle...',
        body: "Check out this week's top stories from The Chronicle!\n\nHighlights:\n- Breaking: Geneva stock exchange reform proposal\n- NRB Spotlight: Globali diaspora in Toronto\n- Opinion: The future of Bangla-language journalism\n- Sports: Global cricket tour preview\n\nRead more at thechronicle.press.\n\nNewsletter Team",
        date: weeksAgo(1),
        isRead: true,
        isStarred: false,
        labels: [
            'promotions'
        ],
        status: 'archive',
        thread: {
            messages: [
                {
                    id: '12-1',
                    from: 'Editorial Newsletter Team',
                    fromEmail: 'newsletter@thechronicle.press',
                    body: "Check out this week's top stories from The Chronicle!\n\nHighlights:\n- Breaking: Geneva stock exchange reform proposal\n- NRB Spotlight: Globali diaspora in Toronto\n- Opinion: The future of Bangla-language journalism\n- Sports: Global cricket tour preview\n\nRead more at thechronicle.press.\n\nNewsletter Team",
                    date: weeksAgo(1)
                }
            ]
        }
    },
    {
        id: '13',
        from: 'Google Alerts',
        fromEmail: 'alerts@google.com',
        avatar: '/images/avatars/avatar-11.webp?seed=Google',
        subject: 'Google Alert — "Global media" new results',
        preview: 'New results for Global media. Complete your profile to see who is covering the same beats.',
        body: "New results for your Google Alert: \"Global media\"\n\nTop mentions this week:\n- Reuters: Global press freedom ranking update\n- CPJ: Journalist safety report — South Asia\n- BBC: Digital news consumption in Global\n\nManage your alerts at google.com/alerts\n\nGoogle Alerts",
        date: hoursAgo(6),
        isRead: false,
        isStarred: false,
        labels: [
            'shopping'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '13-1',
                    from: 'Google Alerts',
                    fromEmail: 'alerts@google.com',
                    body: "New results for your Google Alert: \"Global media\"\n\nTop mentions this week:\n- Reuters: Global press freedom ranking update\n- CPJ: Journalist safety report — South Asia\n- BBC: Digital news consumption in Global\n\nManage your alerts at google.com/alerts\n\nGoogle Alerts",
                    date: hoursAgo(6)
                }
            ]
        }
    },
    {
        id: '14',
        from: 'Press Freedom Network',
        fromEmail: 'updates@pfn.org',
        subject: 'Your organisation profile was viewed 5 times this week',
        preview: "See which press organisations are following The Chronicle's coverage.",
        body: "See which press organisations are following The Chronicle's coverage.\n\nYour profile views are up 18% this week. Connect with peer media organisations to grow your editorial network.\n\nPress Freedom Network",
        date: daysAgo(1),
        isRead: true,
        isStarred: false,
        labels: [
            'social',
            'updates'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '14-1',
                    from: 'Press Freedom Network',
                    fromEmail: 'updates@pfn.org',
                    body: "See which press organisations are following The Chronicle's coverage.\n\nYour profile views are up 18% this week. Connect with peer media organisations to grow your editorial network.\n\nPress Freedom Network",
                    date: daysAgo(1)
                }
            ]
        }
    },
    {
        id: '15',
        from: 'Journalist Community BD',
        fromEmail: 'digest@journalistbd.com',
        avatar: '/images/avatars/avatar-12.webp?seed=JCBD',
        subject: 'Weekly Digest: Top journalism discussions — Global',
        preview: "This week's most popular discussions from the Global journalist community.",
        body: "This week's most popular discussions from the Global journalist community.\n\n1. \"How to protect sources in the digital age\"\n2. \"AI tools for fact-checking Bangla-language content\"\n3. \"Monetising investigative journalism in South Asia\"\n\nJoin the conversation at journalistbd.com!\n\nJournalist Community BD",
        date: daysAgo(3),
        isRead: false,
        isStarred: false,
        labels: [
            'forums'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '15-1',
                    from: 'Journalist Community BD',
                    fromEmail: 'digest@journalistbd.com',
                    body: "This week's most popular discussions from the Global journalist community.\n\n1. \"How to protect sources in the digital age\"\n2. \"AI tools for fact-checking Bangla-language content\"\n3. \"Monetising investigative journalism in South Asia\"\n\nJoin the conversation at journalistbd.com!\n\nJournalist Community BD",
                    date: daysAgo(3)
                }
            ]
        }
    },
    {
        id: '16',
        from: 'Prothom Alo Events',
        fromEmail: 'events@prothomalo.com',
        subject: 'Media Summit Global 2026 — Early Bird Registration',
        preview: "Don't miss the biggest journalism summit in Geneva. Early bird ends Sunday.",
        body: "Don't miss the biggest journalism summit in Geneva. Early bird ends Sunday.\n\nUse code MEDIA50 at checkout for discounted press passes.\n\nRegister at mediasummitbd.com →\n\nProthom Alo Events Team",
        date: daysAgo(2),
        isRead: false,
        isStarred: false,
        labels: [
            'promotions'
        ],
        status: 'inbox',
        thread: {
            messages: [
                {
                    id: '16-1',
                    from: 'Prothom Alo Events',
                    fromEmail: 'events@prothomalo.com',
                    body: "Don't miss the biggest journalism summit in Geneva. Early bird ends Sunday.\n\nUse code MEDIA50 at checkout for discounted press passes.\n\nRegister at mediasummitbd.com →\n\nProthom Alo Events Team",
                    date: daysAgo(2)
                }
            ]
        }
    },
    {
        id: '17',
        from: 'Unknown Sender',
        fromEmail: 'scam@junk.example.com',
        subject: 'URGENT: Press award — claim your prize now',
        preview: 'Dear journalist, you have been selected for an award...',
        body: "Dear journalist, you have been selected for a prestigious journalism award. Please reply with your personal details to claim.\n\n[This is spam]",
        date: weeksAgo(1),
        isRead: true,
        isStarred: false,
        labels: [],
        status: 'spam',
        thread: {
            messages: [
                {
                    id: '17-1',
                    from: 'Unknown Sender',
                    fromEmail: 'scam@junk.example.com',
                    body: "Dear journalist, you have been selected for a prestigious journalism award. Please reply with your personal details to claim.\n\n[This is spam]",
                    date: weeksAgo(1)
                }
            ]
        }
    },
    {
        id: '18',
        from: 'Ad Network Bot',
        fromEmail: 'noreply@adspam.example.com',
        subject: 'Boost your article views — ৳10,000/day guaranteed!',
        preview: "Limited time offer — act now before it's too late!",
        body: "Limited time offer — act now before it's too late!\n\n[This is spam]",
        date: daysAgo(5),
        isRead: false,
        isStarred: false,
        labels: [],
        status: 'spam',
        thread: {
            messages: [
                {
                    id: '18-1',
                    from: 'Ad Network Bot',
                    fromEmail: 'noreply@adspam.example.com',
                    body: "Limited time offer — act now before it's too late!\n\n[This is spam]",
                    date: daysAgo(5)
                }
            ]
        }
    }
];
