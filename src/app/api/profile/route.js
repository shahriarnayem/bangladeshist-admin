import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const queryUserId = searchParams.get('userId');
        const headerUserId = req.headers.get('x-user-id');
        const cookieUserId = req.cookies.get('cms_user_id')?.value;
        const targetUserId = queryUserId || headerUserId || cookieUserId;

        let user = null;
        if (targetUserId) {
            user = await db.user.findUnique({
                where: { id: targetUserId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    image: true,
                    socialLinks: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            articles: true,
                            comments: true,
                            media: true
                        }
                    }
                }
            });
        }

        if (!user) {
            // Default fallback to active super admin / admin
            user = await db.user.findFirst({
                where: {
                    role: {
                        in: ['SUPER_ADMIN', 'ADMIN']
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    image: true,
                    socialLinks: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            articles: true,
                            comments: true,
                            media: true
                        }
                    }
                }
            });
        }

        if (!user) {
            user = await db.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    image: true,
                    socialLinks: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            articles: true,
                            comments: true,
                            media: true
                        }
                    }
                }
            });
        }

        // Also fetch list of available staff users for persona/role switching
        const availableUsers = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true
            },
            orderBy: { createdAt: 'asc' },
            take: 20
        });

        const res = NextResponse.json({
            success: true,
            profile: user,
            availableUsers
        });

        // Ensure session cookie is attached to the response if user was resolved
        if (user?.id) {
            res.cookies.set('cms_user_id', user.id, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30 // 30 days
            });
        }

        return res;
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id: bodyId, name, bio, image, email, role, socialLinks, newPassword } = body;

        const headerUserId = req.headers.get('x-user-id');
        const cookieUserId = req.cookies.get('cms_user_id')?.value;
        const targetId = bodyId || headerUserId || cookieUserId;

        let user = null;
        if (targetId) {
            user = await db.user.findUnique({
                where: { id: targetId }
            });
        }

        if (!user) {
            user = await db.user.findFirst({
                where: {
                    role: { in: ['SUPER_ADMIN', 'ADMIN'] }
                }
            });
        }

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User account not found'
                },
                {
                    status: 404
                }
            );
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (image !== undefined) updateData.image = image;
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (role !== undefined) updateData.role = role;
        if (socialLinks !== undefined) {
            updateData.socialLinks = typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : String(socialLinks);
        }
        if (newPassword && newPassword.trim()) {
            updateData.passwordHash = newPassword.trim();
        }

        const updated = await db.user.update({
            where: {
                id: user.id
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                bio: true,
                image: true,
                socialLinks: true,
                isVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        articles: true,
                        comments: true,
                        media: true
                    }
                }
            }
        });

        await logAudit('update', 'User', user.id, `Updated profile settings for ${updated.name} (${updated.role})`);

        const res = NextResponse.json({
            success: true,
            profile: updated,
            message: 'Profile settings updated successfully'
        });

        // Set session cookie
        res.cookies.set('cms_user_id', updated.id, {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30
        });

        return res;
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { action, userId } = body;

        if (action === 'switch' && userId) {
            const targetUser = await db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    image: true,
                    socialLinks: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            articles: true,
                            comments: true,
                            media: true
                        }
                    }
                }
            });

            if (!targetUser) {
                return NextResponse.json(
                    { success: false, error: 'Target user not found' },
                    { status: 404 }
                );
            }

            await logAudit('switch_persona', 'User', targetUser.id, `Switched active dashboard persona to ${targetUser.name} (${targetUser.role})`);

            const res = NextResponse.json({
                success: true,
                profile: targetUser,
                message: `Active persona switched to ${targetUser.name} (${targetUser.role})`
            });

            res.cookies.set('cms_user_id', targetUser.id, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30
            });

            return res;
        }

        return NextResponse.json(
            { success: false, error: 'Unknown action' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
