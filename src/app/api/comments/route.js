import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') // all, approved, pending, spam
        ;
        const where = {};
        if (status === 'approved') {
            where.isApproved = true;
            where.isReported = false;
        } else if (status === 'pending') {
            where.isApproved = false;
            where.isReported = false;
        } else if (status === 'spam' || status === 'reported') {
            where.isReported = true;
        }
        const comments = await db.comment.findMany({
            where,
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        });
        return NextResponse.json({
            success: true,
            comments
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
        const { articleId, content, guestName, userId } = body;
        if (!articleId || !content?.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Article ID and comment content are required'
            }, {
                status: 400
            });
        }
        const comment = await db.comment.create({
            data: {
                articleId,
                content: content.trim(),
                guestName: guestName?.trim() || 'Reader',
                userId: userId || null,
                isApproved: false,
                isReported: false
            }
        });
        return NextResponse.json({
            success: true,
            comment
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
