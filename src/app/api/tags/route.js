import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
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
        const tags = await db.tag.findMany({
            where,
            include: {
                _count: {
                    select: {
                        articles: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            },
            take: 200
        });
        return NextResponse.json({
            success: true,
            tags
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
        const { name, slug: customSlug } = body;
        if (!name || !name.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Tag name is required'
            }, {
                status: 400
            });
        }
        const finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(name);
        const existing = await db.tag.findUnique({
            where: {
                slug: finalSlug
            }
        });
        if (existing) {
            return NextResponse.json({
                success: true,
                tag: existing
            });
        }
        const tag = await db.tag.create({
            data: {
                name: name.trim(),
                slug: finalSlug
            }
        });
        await logAudit('create', 'Tag', tag.id, `Created tag "${tag.name}"`);
        return NextResponse.json({
            success: true,
            tag
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
