import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const menu = await db.menu.findUnique({
            where: {
                id
            }
        });
        if (!menu) {
            return NextResponse.json({
                success: false,
                error: 'Menu not found'
            }, {
                status: 404
            });
        }
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
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, location, items, isActive } = body;
        const existing = await db.menu.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Menu not found'
            }, {
                status: 404
            });
        }
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (location !== undefined) updateData.location = location;
        if (items !== undefined) updateData.items = typeof items === 'string' ? items : JSON.stringify(items);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        const updated = await db.menu.update({
            where: {
                id
            },
            data: updateData
        });
        await logAudit('update', 'Menu', id, `Updated navigation menu "${updated.name}"`);
        return NextResponse.json({
            success: true,
            menu: updated
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
        const existing = await db.menu.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Menu not found'
            }, {
                status: 404
            });
        }
        await db.menu.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Menu', id, `Deleted menu "${existing.name}"`);
        return NextResponse.json({
            success: true,
            message: 'Menu deleted'
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
