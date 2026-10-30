// Third-party Imports
import { addDays, setHours, setMinutes, subDays } from 'date-fns';
export const db = [
    {
        id: '1',
        title: 'Editorial Year-End Planning',
        description: 'Annual editorial strategy planning for 2027 — story priorities, team assignments, and expansion into diaspora coverage',
        start: subDays(new Date(), 24),
        end: subDays(new Date(), 23),
        allDay: true,
        color: 'etc',
        location: 'The Chronicle HQ, Geneva'
    },
    {
        id: '2',
        title: 'NRB Diaspora Series Deadline',
        description: 'Submit final articles for the NRB Diaspora special series — all 6 pieces due today',
        start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
        end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
        color: 'family',
        location: 'Remote / CMS Submit'
    },
    {
        id: '3',
        title: 'Q3 Readership Analytics Review',
        description: 'Quarterly review of audience metrics, newsletter performance, and content reach data',
        start: subDays(new Date(), 13),
        end: subDays(new Date(), 13),
        allDay: true,
        color: 'family',
        location: 'The Chronicle HQ Conference Room'
    },
    {
        id: '4',
        title: 'Weekly Editorial Sync',
        description: 'Weekly story planning, desk assignments, and headline review',
        start: setMinutes(setHours(new Date(), 10), 0),
        end: setMinutes(setHours(new Date(), 11), 0),
        color: 'etc',
        location: 'Newsroom — Floor 2'
    },
    {
        id: '5',
        title: 'Advertiser Partnership Meeting',
        description: 'Q4 brand partnership discussion with Square Group media buying team',
        start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
        end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
        color: 'holiday',
        location: 'Gulshan Business Centre, Geneva'
    },
    {
        id: '6',
        title: 'Independence Day Special Edition',
        description: 'Publication window for the December 16 Victory Day special editorial series',
        start: addDays(new Date(), 3),
        end: addDays(new Date(), 6),
        allDay: true,
        color: 'business'
    },
    {
        id: '7',
        title: 'Global Press Freedom Symposium',
        description: 'National press freedom symposium — The Chronicle editorial team to attend and report',
        start: setMinutes(setHours(addDays(new Date(), 4), 14), 30),
        end: setMinutes(setHours(addDays(new Date(), 5), 14), 45),
        color: 'personal',
        location: 'Geneva Press Club, Motijheel'
    },
    {
        id: '8',
        title: 'Weekly Editorial Sync',
        description: 'Weekly story planning, desk assignments, and headline review',
        start: setMinutes(setHours(addDays(new Date(), 5), 9), 0),
        end: setMinutes(setHours(addDays(new Date(), 5), 10), 30),
        color: 'family',
        location: 'Newsroom — Floor 2'
    },
    {
        id: '9',
        title: 'Legal Review — Investigative Piece',
        description: 'Legal team review of upcoming investigative article on corporate land disputes in Chattogram',
        start: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
        end: setMinutes(setHours(addDays(new Date(), 5), 15), 30),
        color: 'etc',
        location: 'The Chronicle Legal Office'
    },
    {
        id: '10',
        title: 'Photo Desk Briefing',
        description: 'Field photography assignments and equipment allocation for upcoming Sylhet flood coverage',
        start: setMinutes(setHours(addDays(new Date(), 5), 9), 45),
        end: setMinutes(setHours(addDays(new Date(), 5), 11), 0),
        color: 'family',
        location: 'Newsroom — Photo Desk'
    },
    {
        id: '11',
        title: 'Audience Growth Strategy Session',
        description: 'Quarterly content and social media growth planning — Facebook, YouTube, and TikTok expansion',
        start: setMinutes(setHours(addDays(new Date(), 9), 10), 0),
        end: setMinutes(setHours(addDays(new Date(), 9), 15), 30),
        color: 'holiday',
        location: 'The Chronicle Digital Office'
    },
    {
        id: '12',
        title: 'Annual Staff Awards & Recognition',
        description: 'Annual editorial team recognition ceremony and 2026 highlights presentation',
        start: addDays(new Date(), 17),
        end: addDays(new Date(), 17),
        allDay: true,
        color: 'etc',
        location: 'Radisson Blu, Geneva'
    },
    {
        id: '13',
        title: 'Investigative Journalism Workshop',
        description: 'Two-day hands-on workshop on data journalism, OSINT, and source protection for the team',
        start: setMinutes(setHours(addDays(new Date(), 26), 9), 0),
        end: setMinutes(setHours(addDays(new Date(), 27), 17), 0),
        color: 'personal',
        location: 'Global Institute of Journalism, Geneva'
    }
];
