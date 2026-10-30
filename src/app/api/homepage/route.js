import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const setting = await db.setting.findUnique({
            where: {
                key: 'homepageSections'
            }
        });
        let config = null;
        if (setting?.value) {
            try {
                config = JSON.parse(setting.value);
            } catch  {
                config = null;
            }
        }
        return NextResponse.json({
            success: true,
            config
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
export async function POST(req) {
    try {
        const body = await req.json();
        const { sections, breakingText, breakingEnabled, heroLayout } = body;
        const config = {
            sections,
            breakingText,
            breakingEnabled,
            heroLayout,
            updatedAt: new Date().toISOString()
        };
        await db.setting.upsert({
            where: {
                key: 'homepageSections'
            },
            update: {
                value: JSON.stringify(config)
            },
            create: {
                key: 'homepageSections',
                value: JSON.stringify(config)
            }
        });
        await logAudit('update', 'Setting', 'homepageSections', 'Published updated homepage section layout');
        return NextResponse.json({
            success: true,
            config
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
