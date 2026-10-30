import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const category = await db.category.findUnique({
      where: {
        id
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        children: {
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
      }
    });
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, {
        status: 404
      });
    }
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

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug: customSlug, description, order, isActive, parentId } = body;
    const existing = await db.category.findUnique({
      where: {
        id
      }
    });
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, {
        status: 404
      });
    }
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (customSlug !== undefined && customSlug.trim()) {
      updateData.slug = slugify(customSlug);
    } else if (name !== undefined && (!existing.slug || existing.slug === '')) {
      updateData.slug = slugify(name);
    }
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (order !== undefined) updateData.order = Number(order) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (parentId !== undefined) {
      if (parentId === id) {
        return NextResponse.json({
          success: false,
          error: 'A category cannot be its own parent'
        }, {
          status: 400
        });
      }
      updateData.parentId = (parentId && parentId !== 'none' && String(parentId).trim()) ? String(parentId).trim() : null;
    }

    const updated = await db.category.update({
      where: {
        id
      },
      data: updateData,
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
    await logAudit('update', 'Category', id, `Updated category "${updated.name}"`);
    return NextResponse.json({
      success: true,
      category: updated
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
    const existing = await db.category.findUnique({
      where: {
        id
      }
    });
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, {
        status: 404
      });
    }

    // When deleting, disconnect children or set their parentId to null
    await db.category.updateMany({
      where: { parentId: id },
      data: { parentId: null }
    });

    await db.category.delete({
      where: {
        id
      }
    });
    await logAudit('delete', 'Category', id, `Deleted category "${existing.name}"`);
    return NextResponse.json({
      success: true
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
