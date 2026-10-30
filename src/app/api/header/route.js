import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
const DEFAULT_HEADER_CONFIG = {
    topBarEnabled: true,
    topBarText: 'The Chronicle • Published in New York, London & Tokyo',
    showDateRibbon: true,
    dateFormat: 'gregorian',
    showEditionSelector: true,
    editionName: 'Global International Edition',
    mastheadStyle: 'classic',
    mastheadTitle: 'THE CHRONICLE',
    mastheadMotto: 'Veritas • Libertas • Iustitia — Established 1894',
    logoUrl: '',
    logoAlignment: 'center',
    navSticky: true,
    navAlignment: 'center',
    showSearchButton: true,
    showThemeToggle: true,
    showBreakingTicker: true,
    breakingTickerLabel: 'BREAKING',
    headerNavItems: [
        {
            label: 'World',
            url: '/category/world'
        },
        {
            label: 'Business & Markets',
            url: '/category/business'
        },
        {
            label: 'Technology',
            url: '/category/tech'
        },
        {
            label: 'Policy & Governance',
            url: '/category/policy'
        },
        {
            label: 'Opinion & Editorial',
            url: '/category/opinion'
        },
        {
            label: 'Culture & Arts',
            url: '/category/culture'
        },
        {
            label: 'Science',
            url: '/category/science'
        }
    ]
};
export async function GET() {
    try {
        const record = await db.setting.findUnique({
            where: {
                key: 'header_config'
            }
        });
        if (!record || !record.value) {
            return NextResponse.json({
                success: true,
                config: DEFAULT_HEADER_CONFIG
            });
        }
        try {
            const parsed = JSON.parse(record.value);
            return NextResponse.json({
                success: true,
                config: {
                    ...DEFAULT_HEADER_CONFIG,
                    ...parsed
                }
            });
        } catch  {
            return NextResponse.json({
                success: true,
                config: DEFAULT_HEADER_CONFIG
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
export async function POST(req) {
    try {
        const body = await req.json();
        const serialized = JSON.stringify(body);
        await db.setting.upsert({
            where: {
                key: 'header_config'
            },
            update: {
                value: serialized
            },
            create: {
                key: 'header_config',
                value: serialized
            }
        });
        await logAudit('update', 'Setting', 'header_config', 'Updated newsroom Header layout and masthead settings');
        return NextResponse.json({
            success: true,
            message: 'Header layout saved successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
