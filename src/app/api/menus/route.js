import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify, logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const rawMenus = await db.menu.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        const menus = rawMenus.map((m)=>{
            let parsedItems = [];
            try {
                parsedItems = typeof m.items === 'string' ? JSON.parse(m.items) : m.items;
            } catch  {
                parsedItems = [];
            }
            return {
                ...m,
                items: Array.isArray(parsedItems) ? parsedItems : []
            };
        });
        return NextResponse.json({
            success: true,
            menus
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
        const { id, location = 'HEADER', items = [], isActive = true } = body;
        const name = body.name || body.title;
        if (!name || !name.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Menu name is required'
            }, {
                status: 400
            });
        }
        const slug = slugify(name);
        const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
        let menu;
        if (id) {
            menu = await db.menu.upsert({
                where: {
                    id
                },
                update: {
                    name: name.trim(),
                    location,
                    items: itemsJson,
                    isActive: Boolean(isActive)
                },
                create: {
                    id,
                    name: name.trim(),
                    slug,
                    location,
                    items: itemsJson,
                    isActive: Boolean(isActive)
                }
            });
        } else {
            menu = await db.menu.upsert({
                where: {
                    slug
                },
                update: {
                    name: name.trim(),
                    location,
                    items: itemsJson,
                    isActive: Boolean(isActive)
                },
                create: {
                    name: name.trim(),
                    slug,
                    location,
                    items: itemsJson,
                    isActive: Boolean(isActive)
                }
            });
        }
        await logAudit('update', 'Menu', menu.id, `Saved navigation menu "${menu.name}"`);
        return NextResponse.json({
            success: true,
            menu
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
