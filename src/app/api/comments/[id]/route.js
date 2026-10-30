import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isApproved, isReported } = body;
        const updateData = {};
        if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);
        if (isReported !== undefined) updateData.isReported = Boolean(isReported);
        const updated = await db.comment.update({
            where: {
                id
            },
            data: updateData
        });
        const action = isApproved ? 'approve' : isReported ? 'reject' : 'update';
        await logAudit(action, 'Comment', id, `Comment moderation status updated`);
        return NextResponse.json({
            success: true,
            comment: updated
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
        await db.comment.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Comment', id, 'Deleted comment permanently');
        return NextResponse.json({
            success: true,
            message: 'Comment deleted'
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
