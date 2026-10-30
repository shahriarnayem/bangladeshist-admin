import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const media = await db.media.findUnique({
            where: {
                id
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
        if (!media) {
            return NextResponse.json({
                success: false,
                error: 'Media not found'
            }, {
                status: 404
            });
        }
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
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const media = await db.media.findUnique({
            where: {
                id
            }
        });
        if (!media) {
            return NextResponse.json({
                success: false,
                error: 'Media not found'
            }, {
                status: 404
            });
        }
        // Identify user from header or cookie
        const headerUserId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('userId');
        let activeUser = null;
        if (headerUserId) {
            activeUser = await db.user.findUnique({
                where: {
                    id: headerUserId
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
                }
            });
        }
        // Permission check: Admins can delete anything; non-admins can only delete their own
        const isAdmin = activeUser && (activeUser.role === 'ADMIN' || activeUser.role === 'SUPER_ADMIN');
        if (!isAdmin && media.userId !== activeUser?.id) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized: You can only delete your own media uploads'
            }, {
                status: 403
            });
        }
        await db.media.delete({
            where: {
                id
            }
        });
        await logAudit('delete', 'Media', id, `Deleted media "${media.name}"`, activeUser?.id);
        return NextResponse.json({
            success: true,
            message: 'Media deleted successfully'
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
