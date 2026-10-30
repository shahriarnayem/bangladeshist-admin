import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const user = await db.user.findFirst({
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
                role: true,
                bio: true,
                image: true,
                createdAt: true,
                _count: {
                    select: {
                        articles: true
                    }
                }
            }
        });
        return NextResponse.json({
            success: true,
            profile: user
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
export async function PUT(req) {
    try {
        const body = await req.json();
        const { name, bio, image, email } = body;
        const user = await db.user.findFirst({
            where: {
                role: {
                    in: [
                        'SUPER_ADMIN',
                        'ADMIN'
                    ]
                }
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
        const updated = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                name: name?.trim() || user.name,
                bio: bio?.trim() || user.bio,
                image: image || user.image,
                email: email?.trim().toLowerCase() || user.email
            }
        });
        await logAudit('update', 'User', user.id, `Updated profile for ${updated.name}`);
        return NextResponse.json({
            success: true,
            profile: updated
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
