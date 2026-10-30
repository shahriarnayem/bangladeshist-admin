import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const rawSettings = await db.setting.findMany();
        const settings = {};
        for (const s of rawSettings){
            try {
                settings[s.key] = JSON.parse(s.value);
            } catch  {
                settings[s.key] = s.value;
            }
        }
        // Also merge appearance fields if present so settings page has full logo/branding
        if (settings.appearance && typeof settings.appearance === 'object') {
            if (!settings.logoUrl && settings.appearance.logoUrl) settings.logoUrl = settings.appearance.logoUrl;
            if (!settings.darkLogoUrl && settings.appearance.darkLogoUrl) settings.darkLogoUrl = settings.appearance.darkLogoUrl;
            if (!settings.faviconUrl && settings.appearance.faviconUrl) settings.faviconUrl = settings.appearance.faviconUrl;
            if (!settings.siteName && settings.appearance.siteName) settings.siteName = settings.appearance.siteName;
            if (!settings.tagline && settings.appearance.tagline) settings.tagline = settings.appearance.tagline;
        }
        return NextResponse.json({
            success: true,
            settings
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
        // Flatten if client passed { settings: { ... } }
        const flatEntries = {
            ...body,
            ...body.settings && typeof body.settings === 'object' ? body.settings : {}
        };
        delete flatEntries.settings;
        const upsertPromises = Object.entries(flatEntries).map(([key, val])=>{
            const stringValue = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return db.setting.upsert({
                where: {
                    key
                },
                update: {
                    value: stringValue
                },
                create: {
                    key,
                    value: stringValue
                }
            });
        });
        await Promise.all(upsertPromises);
        // Synchronize branding/logos with appearance setting
        if (flatEntries.logoUrl !== undefined || flatEntries.darkLogoUrl !== undefined || flatEntries.faviconUrl !== undefined || flatEntries.siteName !== undefined) {
            try {
                const appearanceRecord = await db.setting.findUnique({
                    where: {
                        key: 'appearance'
                    }
                });
                let currentAppearance = {};
                if (appearanceRecord?.value) {
                    try {
                        currentAppearance = JSON.parse(appearanceRecord.value);
                    } catch  {
                        currentAppearance = {};
                    }
                }
                if (flatEntries.logoUrl !== undefined) currentAppearance.logoUrl = flatEntries.logoUrl;
                if (flatEntries.darkLogoUrl !== undefined) currentAppearance.darkLogoUrl = flatEntries.darkLogoUrl;
                if (flatEntries.faviconUrl !== undefined) currentAppearance.faviconUrl = flatEntries.faviconUrl;
                if (flatEntries.siteName !== undefined) currentAppearance.siteName = flatEntries.siteName;
                if (flatEntries.tagline !== undefined) currentAppearance.tagline = flatEntries.tagline;
                await db.setting.upsert({
                    where: {
                        key: 'appearance'
                    },
                    update: {
                        value: JSON.stringify(currentAppearance)
                    },
                    create: {
                        key: 'appearance',
                        value: JSON.stringify(currentAppearance)
                    }
                });
            } catch (err) {
                console.warn('Sync appearance warning:', err.message);
            }
        }
        await logAudit('update', 'Setting', 'global', 'Updated newsroom CMS settings');
        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
            settings: flatEntries
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
