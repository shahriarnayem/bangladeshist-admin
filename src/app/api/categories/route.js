import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            articles: true
          }
        }
      },
      orderBy: [
        {
          order: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    });
    return NextResponse.json({
      success: true,
      categories
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
    const { name, slug: customSlug, description, order = 0, isActive = true, parentId = null } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, {
        status: 400
      });
    }
    const finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(name);
    const finalParentId = (parentId && parentId !== 'none' && String(parentId).trim()) ? String(parentId).trim() : null;

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        order: Number(order) || 0,
        isActive: Boolean(isActive),
        parentId: finalParentId
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    await logAudit('create', 'Category', category.id, `Created category "${category.name}"`);
    return NextResponse.json({
      success: true,
      category
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
