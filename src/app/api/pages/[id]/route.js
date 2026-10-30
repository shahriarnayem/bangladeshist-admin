import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const page = await db.page.findUnique({
            where: {
                id
            }
        });
        if (!page) {
            return NextResponse.json({
                success: false,
                error: 'Page not found'
            }, {
                status: 404
            });
        }
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
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            title,
            slug: customSlug,
            content,
            excerpt,
            isPublished,
            showInHeader,
            showInFooter,
            metaTitle,
            metaDescription,
            canonicalUrl,
            ogImage
        } = body;
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (customSlug !== undefined) updateData.slug = slugify(customSlug);
        if (content !== undefined) updateData.content = content?.trim() || '';
        if (excerpt !== undefined) updateData.excerpt = excerpt?.trim() || null;
        if (isPublished !== undefined) updateData.status = isPublished ? 'PUBLISHED' : 'DRAFT';
        if (showInFooter !== undefined) updateData.showInFooter = Boolean(showInFooter);
        if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || null;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || null;
        if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl?.trim() || null;
        if (ogImage !== undefined) updateData.ogImage = ogImage?.trim() || null;
        const updated = await db.page.update({
            where: {
                id
            },
            data: updateData
        });
        await logAudit('update', 'Page', id, `Updated static page "${updated.title}"`);
        return NextResponse.json({
            success: true,
            page: updated
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
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const existing = await db.page.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Page not found'
            }, {
                status: 404
            });
        }
        await db.page.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Page', id, `Deleted static page "${existing.title}"`);
        return NextResponse.json({
            success: true,
            message: 'Page deleted'
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
