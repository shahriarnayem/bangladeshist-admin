import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, role, bio, isBanned, isVerified } = body;
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (role !== undefined) updateData.role = role;
        if (bio !== undefined) updateData.bio = bio?.trim();
        if (isBanned !== undefined) updateData.isBanned = Boolean(isBanned);
        if (isVerified !== undefined) updateData.isVerified = Boolean(isVerified);
        const updated = await db.user.update({
            where: {
                id
            },
            data: updateData
        });
        await logAudit('update', 'User', id, `Updated user ${updated.name} (banned: ${updated.isBanned}, role: ${updated.role})`);
        return NextResponse.json({
            success: true,
            user: updated
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
        const user = await db.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, {
                status: 404
            });
        }
        await db.user.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'User', id, `Deleted staff user ${user.name}`);
        return NextResponse.json({
            success: true,
            message: 'User deleted'
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
