import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isActive, title, zone, imageUrl, linkUrl, htmlCode } = body;
        const updateData = {};
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (title !== undefined) updateData.title = title.trim();
        if (zone !== undefined) updateData.zone = zone;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
        if (htmlCode !== undefined) updateData.htmlCode = htmlCode;
        const updated = await db.ad.update({
            where: {
                id
            },
            data: updateData
        });
        await logAudit('update', 'Ad', id, `Updated ad placement "${updated.title}"`);
        return NextResponse.json({
            success: true,
            ad: updated
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
        await db.ad.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Ad', id, 'Deleted ad placement');
        return NextResponse.json({
            success: true,
            message: 'Ad deleted'
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
