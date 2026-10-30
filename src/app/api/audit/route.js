import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const entity = searchParams.get('entity');
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const where = {};
        if (action && action !== 'all') where.action = action;
        if (entity && entity !== 'all') where.entity = entity;
        const logs = await db.auditLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
        const formatted = logs.map((l)=>({
                id: l.id,
                action: l.action,
                entity: l.entity,
                entityId: l.entityId,
                details: l.details || '',
                editor: l.user?.name ? `${l.user.name} (${l.user.role})` : 'System Admin',
                ip: '103.145.118.24',
                timestamp: l.createdAt.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            }));
        return NextResponse.json({
            success: true,
            logs: formatted
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
        const { action, entity, entityId, details, userId } = body;
        const user = userId ? {
            id: userId
        } : await db.user.findFirst({
            where: {
                role: {
                    in: [
                        'SUPER_ADMIN',
                        'ADMIN'
                    ]
                }
            }
        });
        const log = await db.auditLog.create({
            data: {
                action: action || 'event',
                entity: entity || 'System',
                entityId: entityId || 'sys-1',
                details: typeof details === 'string' ? details : JSON.stringify(details || {}),
                userId: user?.id || null
            }
        });
        return NextResponse.json({
            success: true,
            log
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
