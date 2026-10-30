import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isActive } = body;
        const updated = await db.poll.update({
            where: {
                id
            },
            data: {
                isActive: Boolean(isActive)
            }
        });
        await logAudit('update', 'Poll', id, `Toggled poll active status to ${isActive}`);
        return NextResponse.json({
            success: true,
            poll: updated
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
        await db.poll.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Poll', id, 'Deleted opinion poll');
        return NextResponse.json({
            success: true,
            message: 'Poll removed'
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
