import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isActive } = body;
        const existing = await db.setting.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Redirect not found'
            }, {
                status: 404
            });
        }
        let parsed = JSON.parse(existing.value);
        parsed.isActive = Boolean(isActive);
        parsed.updatedAt = new Date().toISOString();
        await db.setting.update({
            where: {
                id
            },
            data: {
                value: JSON.stringify(parsed)
            }
        });
        await logAudit('update', 'Redirect', id, `Toggled redirect active status`);
        return NextResponse.json({
            success: true,
            redirect: parsed
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
        await db.setting.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Redirect', id, 'Deleted redirect rule');
        return NextResponse.json({
            success: true,
            message: 'Redirect rule removed'
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
