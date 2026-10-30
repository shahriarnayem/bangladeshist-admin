import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    summary: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    slug: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        if (status && status !== 'ALL') {
            where.status = status;
        }
        if (category && category !== 'ALL') {
            where.OR = [
                {
                    categoryId: category
                },
                {
                    category: {
                        slug: category
                    }
                }
            ];
        }
        const [articles, total] = await Promise.all([
            db.article.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip
            }),
            db.article.count({
                where
            })
        ]);
        return NextResponse.json({
            success: true,
            articles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('[API articles GET error]:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch articles'
        }, {
            status: 500
        });
    }
}
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, slug: customSlug, summary, content, categoryId, authorId, status = 'PUBLISHED', featuredImage, isBreaking = false, isFeatured = false } = body;
        if (!title || !title.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Headline title is required'
            }, {
                status: 400
            });
        }
        const finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
        // Fallback author
        let finalAuthorId = authorId;
        if (!finalAuthorId) {
            const defaultUser = await db.user.findFirst({
                where: {
                    role: {
                        in: [
                            'SUPER_ADMIN',
                            'ADMIN',
                            'EDITOR'
                        ]
                    }
                }
            });
            finalAuthorId = defaultUser?.id;
        }
        // Fallback category
        let finalCategoryId = categoryId;
        if (!finalCategoryId) {
            const defaultCat = await db.category.findFirst({
                where: {
                    isActive: true
                }
            });
            finalCategoryId = defaultCat?.id;
        }
        const article = await db.article.create({
            data: {
                title: title.trim(),
                slug: finalSlug,
                summary: summary?.trim() || null,
                content: content?.trim() || '',
                categoryId: finalCategoryId,
                authorId: finalAuthorId,
                status: status,
                featuredImage: featuredImage || null,
                isBreaking: Boolean(isBreaking),
                isFeatured: Boolean(isFeatured),
                publishDate: status === 'PUBLISHED' ? new Date() : null
            },
            include: {
                category: true,
                author: true
            }
        });
        await logAudit('publish', 'Article', article.id, `Created article "${article.title}"`);
        return NextResponse.json({
            success: true,
            article
        });
    } catch (error) {
        console.error('[API articles POST error]:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create article'
        }, {
            status: 500
        });
    }
}
