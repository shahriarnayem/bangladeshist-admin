import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
const DEFAULT_SEO = {
    metaTitle: '%s - The Chronicle | Independent Global Journalism',
    metaDesc: 'The Chronicle delivers rigorous investigative reporting, macroeconomic intelligence, and cultural analysis across global hubs.',
    ogImage: 'https://thechronicle.press/og-default.jpg',
    canonicalDomain: 'https://thechronicle.press',
    robotsTxt: 'User-agent: *\nDisallow: /dashboard/\nDisallow: /api/\nAllow: /\n\nSitemap: https://thechronicle.press/sitemap.xml',
    sitemapEnabled: true
};
export async function GET() {
    try {
        const record = await db.setting.findUnique({
            where: {
                key: 'seo_settings'
            }
        });
        if (!record || !record.value) {
            return NextResponse.json({
                success: true,
                seo: DEFAULT_SEO
            });
        }
        try {
            const parsed = JSON.parse(record.value);
            return NextResponse.json({
                success: true,
                seo: {
                    ...DEFAULT_SEO,
                    ...parsed
                }
            });
        } catch  {
            return NextResponse.json({
                success: true,
                seo: DEFAULT_SEO
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
                key: 'seo_settings'
            },
            update: {
                value: serialized
            },
            create: {
                key: 'seo_settings',
                value: serialized
            }
        });
        await logAudit('update', 'Setting', 'seo_settings', 'Updated newsroom SEO and indexing metadata');
        return NextResponse.json({
            success: true,
            message: 'SEO configuration saved'
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
