import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search')?.trim() || '';
        const where = {};
        if (role && role !== 'ALL') {
            where.role = role;
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
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    bio: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        const users = await db.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                bio: true,
                image: true,
                isVerified: true,
                isBanned: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        });
        return NextResponse.json({
            success: true,
            users
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
        const { name, email, role = 'AUTHOR', bio } = body;
        if (!name?.trim() || !email?.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Name and email are required'
            }, {
                status: 400
            });
        }
        const existing = await db.user.findUnique({
            where: {
                email: email.trim().toLowerCase()
            }
        });
        if (existing) {
            return NextResponse.json({
                success: false,
                error: 'A staff member with this email already exists'
            }, {
                status: 400
            });
        }
        const user = await db.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                role: role,
                bio: bio?.trim() || 'Newsroom Contributor',
                isVerified: true,
                isBanned: false
            }
        });
        await logAudit('create', 'User', user.id, `Created staff member ${user.name} with role ${user.role}`);
        return NextResponse.json({
            success: true,
            user
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
