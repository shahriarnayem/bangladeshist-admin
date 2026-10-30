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
              slug: true,
              parent: {
                select: {
                  id: true,
                  name: true
                }
              }
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
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch articles'
      },
      {
        status: 500
      }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      summary,
      content,
      categoryId,
      authorId,
      source,
      tagNames = [],
      tagIds = [],
      status = 'PUBLISHED',
      featuredImage,
      isBreaking = false,
      isFeatured = false,
      metaTitle,
      metaDescription,
      canonicalUrl,
      keywords,
      ogImage
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Headline title is required'
        },
        {
          status: 400
        }
      );
    }

    const finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);

    // Auto-detect author from request header/cookie or provided authorId, falling back to active editorial user
    let finalAuthorId = authorId;
    if (!finalAuthorId) {
      const headerUserId = req.headers.get('x-user-id');
      const cookieUserId = req.cookies.get('cms_user_id')?.value;
      const targetUserId = headerUserId || cookieUserId;

      if (targetUserId) {
        const matchedUser = await db.user.findUnique({
          where: { id: targetUserId },
          select: { id: true }
        });
        if (matchedUser) finalAuthorId = matchedUser.id;
      }
    }

    if (!finalAuthorId) {
      const defaultUser = await db.user.findFirst({
        where: {
          role: {
            in: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR']
          }
        },
        select: { id: true }
      });
      finalAuthorId = defaultUser?.id;
    }

    // Fallback category if none specified
    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      const defaultCat = await db.category.findFirst({
        where: {
          isActive: true
        },
        select: { id: true }
      });
      finalCategoryId = defaultCat?.id;
    }

    // Resolve Tags: Upsert any tag names and collect their IDs
    let resolvedTagIds = Array.isArray(tagIds) ? [...tagIds] : [];
    if (Array.isArray(tagNames) && tagNames.length > 0) {
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
          // If upsert fails, continue
        }
      }
    }

    const article = await db.article.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        summary: summary?.trim() || null,
        content: content?.trim() || '',
        categoryId: finalCategoryId,
        authorId: finalAuthorId || null,
        source: source?.trim() || null,
        tagIds: resolvedTagIds,
        status: status,
        featuredImage: featuredImage || null,
        isBreaking: Boolean(isBreaking),
        isFeatured: Boolean(isFeatured),
        publishDate: status === 'PUBLISHED' ? new Date() : null,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        canonicalUrl: canonicalUrl?.trim() || null,
        keywords: keywords?.trim() || null,
        ogImage: ogImage?.trim() || null
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

    await logAudit('publish', 'Article', article.id, `Created article "${article.title}"`);

    return NextResponse.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('[API articles POST error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create article'
      },
      {
        status: 500
      }
    );
  }
}
