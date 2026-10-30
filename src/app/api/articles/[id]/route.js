import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const article = await db.article.findUnique({
            where: {
                id
            },
            include: {
                category: true,
                author: true,
                tags: true
            }
        });
        if (!article) {
            return NextResponse.json({
                success: false,
                error: 'Article not found'
            }, {
                status: 404
            });
        }
        return NextResponse.json({
            success: true,
            article
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
        const { title, slug: customSlug, summary, content, categoryId, authorId, status, featuredImage, isBreaking, isFeatured } = body;
        const existing = await db.article.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Article not found'
            }, {
                status: 404
            });
        }
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (customSlug !== undefined) updateData.slug = slugify(customSlug);
        if (summary !== undefined) updateData.summary = summary?.trim() || null;
        if (content !== undefined) updateData.content = content?.trim() || '';
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (authorId !== undefined) updateData.authorId = authorId;
        if (status !== undefined) {
            updateData.status = status;
            if (status === 'PUBLISHED' && !existing.publishDate) {
                updateData.publishDate = new Date();
            }
        }
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (isBreaking !== undefined) updateData.isBreaking = Boolean(isBreaking);
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
        const updated = await db.article.update({
            where: {
                id
            },
            data: updateData,
            include: {
                category: true,
                author: true
            }
        });
        await logAudit('update', 'Article', id, `Updated article "${updated.title}"`);
        return NextResponse.json({
            success: true,
            article: updated
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
        const existing = await db.article.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Article not found'
            }, {
                status: 404
            });
        }
        await db.article.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Article', id, `Deleted article "${existing.title}"`);
        return NextResponse.json({
            success: true,
            message: 'Article deleted successfully'
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
