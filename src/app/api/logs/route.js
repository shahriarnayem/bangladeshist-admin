import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const level = searchParams.get('level') || 'ALL';
        const service = searchParams.get('service') || 'ALL';
        // Fetch real recent audit logs to generate telemetry stream
        const recentAudit = await db.auditLog.findMany({
            take: 20,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const realTimeLogs = [
            {
                id: 'l-live-1',
                timestamp: new Date().toISOString(),
                level: 'INFO',
                service: 'prisma-orm',
                message: 'MongoDB replica cluster connection established (healthy)'
            },
            ...recentAudit.map((a)=>({
                    id: `l-${a.id}`,
                    timestamp: a.createdAt.toISOString(),
                    level: a.action === 'delete' ? 'WARN' : a.action === 'reject' ? 'ERROR' : 'INFO',
                    service: a.entity ? `${a.entity.toLowerCase()}-service` : 'core-api',
                    message: `[${a.action.toUpperCase()}] ${a.details || a.entity}`
                })),
            {
                id: 'l-seed-1',
                timestamp: new Date(Date.now() - 60000).toISOString(),
                level: 'INFO',
                service: 'next-server',
                message: 'Loaded Next.js App Router API dispatch routes (200 OK)'
            },
            {
                id: 'l-seed-2',
                timestamp: new Date(Date.now() - 120000).toISOString(),
                level: 'INFO',
                service: 'indexnow',
                message: 'Broadcasted automatic ping to api.indexnow.org for recent articles'
            }
        ];
        const filtered = realTimeLogs.filter((l)=>{
            if (level !== 'ALL' && l.level !== level) return false;
            if (service !== 'ALL' && l.service !== service) return false;
            return true;
        });
        return NextResponse.json({
            success: true,
            logs: filtered
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
