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
                category: {
                    include: {
                        parent: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                },
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
        const {
            title,
            slug: customSlug,
            summary,
            content,
            categoryId,
            categoryIds,
            authorId,
            source,
            tagNames,
            tagIds,
            status,
            featuredImage,
            isBreaking,
            isFeatured,
            metaTitle,
            metaDescription,
            canonicalUrl,
            keywords,
            ogImage
        } = body;
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
        if (categoryIds !== undefined && Array.isArray(categoryIds)) {
            const cleanIds = categoryIds.filter(Boolean);
            updateData.categoryIds = cleanIds;
            if (cleanIds.length > 0 && !categoryId) {
                updateData.categoryId = cleanIds[0];
            }
        }
        if (categoryId !== undefined) {
            updateData.categoryId = categoryId;
            if (updateData.categoryIds && !updateData.categoryIds.includes(categoryId)) {
                updateData.categoryIds = [categoryId, ...updateData.categoryIds];
            }
        }
        if (authorId !== undefined) updateData.authorId = authorId;
        if (source !== undefined) updateData.source = source?.trim() || null;

        if (Array.isArray(tagNames)) {
            const resolvedTagIds = [];
            for (const rawName of tagNames) {
                const cleanName = typeof rawName === 'string' ? rawName.trim() : '';
                if (!cleanName) continue;
                const tSlug = slugify(cleanName);
                try {
                    const tag = await db.tag.upsert({
                        where: { slug: tSlug },
                        update: { count: { increment: 1 } },
                        create: { name: cleanName, slug: tSlug, count: 1 }
                    });
                    if (!resolvedTagIds.includes(tag.id)) {
                        resolvedTagIds.push(tag.id);
                    }
                } catch {
                    // Ignore individual upsert error
                }
            }
            updateData.tagIds = resolvedTagIds;
        } else if (Array.isArray(tagIds)) {
            updateData.tagIds = tagIds;
        }

        if (status !== undefined) {
            updateData.status = status;
            if (status === 'PUBLISHED' && !existing.publishDate) {
                updateData.publishDate = new Date();
            }
        }
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (isBreaking !== undefined) updateData.isBreaking = Boolean(isBreaking);
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
        if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || null;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || null;
        if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl?.trim() || null;
        if (keywords !== undefined) updateData.keywords = keywords?.trim() || null;
        if (ogImage !== undefined) updateData.ogImage = ogImage?.trim() || null;
        const updated = await db.article.update({
            where: {
                id
            },
            data: updateData,
            include: {
                category: {
                    include: {
                        parent: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                },
                tags: true
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
