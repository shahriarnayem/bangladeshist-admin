import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function POST(req) {
    try {
        const body = await req.json();
        const { data } = body;
        if (!data) {
            return NextResponse.json({
                success: false,
                error: 'Invalid backup format'
            }, {
                status: 400
            });
        }
        let restoredCount = 0;
        // Restore categories if present
        if (Array.isArray(data.categories)) {
            for (const cat of data.categories){
                if (cat.name && cat.slug) {
                    await db.category.upsert({
                        where: {
                            slug: cat.slug
                        },
                        update: {
                            name: cat.name,
                            description: cat.description
                        },
                        create: {
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description
                        }
                    });
                    restoredCount++;
                }
            }
        }
        // Restore settings if present
        if (Array.isArray(data.settings)) {
            for (const s of data.settings){
                if (s.key && s.value) {
                    await db.setting.upsert({
                        where: {
                            key: s.key
                        },
                        update: {
                            value: s.value
                        },
                        create: {
                            key: s.key,
                            value: s.value
                        }
                    });
                    restoredCount++;
                }
            }
        }
        await logAudit('restore', 'Backup', 'import', `Restored ${restoredCount} database entities`);
        return NextResponse.json({
            success: true,
            restoredCount
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
