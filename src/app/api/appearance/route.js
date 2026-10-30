import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const setting = await db.setting.findUnique({
            where: {
                key: 'appearance'
            }
        });
        let appearance = null;
        if (setting?.value) {
            try {
                appearance = JSON.parse(setting.value);
            } catch  {
                appearance = null;
            }
        }
        return NextResponse.json({
            success: true,
            appearance
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
        await db.setting.upsert({
            where: {
                key: 'appearance'
            },
            update: {
                value: JSON.stringify(body)
            },
            create: {
                key: 'appearance',
                value: JSON.stringify(body)
            }
        });
        await logAudit('update', 'Setting', 'appearance', 'Updated branding and theme appearance customizer');
        return NextResponse.json({
            success: true,
            appearance: body
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
