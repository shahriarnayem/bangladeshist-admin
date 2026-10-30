import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const ads = await db.ad.findMany({
            orderBy: [
                {
                    zone: 'asc'
                },
                {
                    order: 'asc'
                }
            ]
        });
        return NextResponse.json({
            success: true,
            ads
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
        const { zone = 'header', title, imageUrl, linkUrl, htmlCode, isActive = true, order = 0 } = body;
        if (!title || !title.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Campaign title is required'
            }, {
                status: 400
            });
        }
        const ad = await db.ad.create({
            data: {
                zone,
                title: title.trim(),
                imageUrl: imageUrl?.trim() || null,
                linkUrl: linkUrl?.trim() || null,
                htmlCode: htmlCode?.trim() || null,
                isActive: Boolean(isActive),
                order: Number(order) || 0
            }
        });
        await logAudit('create', 'Ad', ad.id, `Created ad placement "${ad.title}" in zone ${ad.zone}`);
        return NextResponse.json({
            success: true,
            ad
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
