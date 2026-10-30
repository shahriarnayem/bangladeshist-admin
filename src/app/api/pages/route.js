import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const pages = await db.page.findMany({
            orderBy: {
                title: 'asc'
            }
        });
        return NextResponse.json({
            success: true,
            pages
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
        const { title, slug: customSlug, content, excerpt, isPublished = true, showInHeader = false, showInFooter = true } = body;
        if (!title || !title.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Page title is required'
            }, {
                status: 400
            });
        }
        const finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
        const page = await db.page.create({
            data: {
                title: title.trim(),
                slug: finalSlug,
                content: content?.trim() || '',
                excerpt: excerpt?.trim() || null,
                status: isPublished ? 'PUBLISHED' : 'DRAFT',
                showInFooter: Boolean(showInFooter)
            }
        });
        await logAudit('create', 'Page', page.id, `Created static page "${page.title}"`);
        return NextResponse.json({
            success: true,
            page
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
