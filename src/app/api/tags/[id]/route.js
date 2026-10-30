import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const existing = await db.tag.findUnique({
            where: {
                id
            }
        });
        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Tag not found'
            }, {
                status: 404
            });
        }
        await db.tag.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Tag', id, `Deleted tag "${existing.name}"`);
        return NextResponse.json({
            success: true,
            message: 'Tag removed'
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
