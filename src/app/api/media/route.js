import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search')?.trim() || '';
        const uploaderFilter = searchParams.get('uploaderId');
        // 1. Identify active user
        const headerUserId = req.headers.get('x-user-id');
        const queryUserId = searchParams.get('userId');
        const cookieUserId = req.cookies.get('cms_user_id')?.value;
        const activeUserId = queryUserId || headerUserId || cookieUserId;
        let activeUser = null;
        if (activeUserId) {
            activeUser = await db.user.findUnique({
                where: {
                    id: activeUserId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
        }
        if (!activeUser) {
            activeUser = await db.user.findFirst({
                where: {
                    role: {
                        in: [
                            'SUPER_ADMIN',
                            'ADMIN'
                        ]
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
        }
        const isAdmin = activeUser ? activeUser.role === 'ADMIN' || activeUser.role === 'SUPER_ADMIN' : true;
        // 2. Build where filter based on role permissions:
        // Only admins can see all images. All other users can only see their own images!
        const where = {};
        if (!isAdmin && activeUser) {
            where.userId = activeUser.id;
        } else if (isAdmin && uploaderFilter && uploaderFilter !== 'all') {
            where.userId = uploaderFilter;
        }
        if (type && type !== 'all') {
            where.type = type;
        }
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    caption: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        const media = await db.media.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: 120,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        return NextResponse.json({
            success: true,
            media,
            currentUser: activeUser,
            isAdmin,
            totalCount: media.length
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
        const { name, url, type = 'image', mimeType = 'image/webp', size = 0, width, height, caption, userId } = body;
        if (!url || !url.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Media URL is required'
            }, {
                status: 400
            });
        }
        // Resolve uploader
        const headerUserId = req.headers.get('x-user-id');
        const cookieUserId = req.cookies.get('cms_user_id')?.value;
        const resolvedUserId = userId || headerUserId || cookieUserId;
        let uploader = null;
        if (resolvedUserId) {
            uploader = await db.user.findUnique({
                where: {
                    id: resolvedUserId
                },
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            });
        }
        if (!uploader) {
            uploader = await db.user.findFirst({
                where: {
                    role: {
                        in: [
                            'SUPER_ADMIN',
                            'ADMIN'
                        ]
                    }
                },
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            });
        }
        const media = await db.media.create({
            data: {
                name: name?.trim() || 'Uploaded Media',
                url: url.trim(),
                type,
                mimeType,
                size: Number(size) || 0,
                width: width ? Number(width) : null,
                height: height ? Number(height) : null,
                caption: caption?.trim() || null,
                userId: uploader?.id || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        await logAudit('create', 'Media', media.id, `Uploaded media "${media.name}"`, uploader?.id);
        return NextResponse.json({
            success: true,
            media
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
