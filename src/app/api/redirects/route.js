import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const rawRedirects = await db.setting.findMany({
            where: {
                key: {
                    startsWith: 'redirect:'
                }
            }
        });
        const redirects = rawRedirects.map((r)=>{
            try {
                const parsed = JSON.parse(r.value);
                return {
                    id: r.id,
                    key: r.key,
                    source: parsed.source || r.key.replace(/^redirect:/, ''),
                    target: parsed.destination || parsed.target,
                    statusCode: parsed.statusCode || 301,
                    hits: parsed.clicks || 0,
                    isActive: parsed.isActive ?? true,
                    lastAccessed: parsed.updatedAt || 'Recent',
                    note: parsed.note || 'Slug forward'
                };
            } catch  {
                return {
                    id: r.id,
                    key: r.key,
                    source: r.key.replace(/^redirect:/, ''),
                    target: r.value,
                    statusCode: 301,
                    hits: 0,
                    isActive: true,
                    lastAccessed: 'Recent',
                    note: 'Redirect rule'
                };
            }
        });
        return NextResponse.json({
            success: true,
            redirects
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
        const { source, target, statusCode = 301, note = '' } = body;
        if (!source?.trim() || !target?.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Source and target are required'
            }, {
                status: 400
            });
        }
        const cleanSource = source.trim().startsWith('/') ? source.trim().slice(1) : source.trim();
        const key = `redirect:${cleanSource.toLowerCase()}`;
        const redirectData = {
            source: `/${cleanSource}`,
            destination: target.trim(),
            statusCode: Number(statusCode) === 302 ? 302 : 301,
            clicks: 0,
            isActive: true,
            note: note.trim() || 'Manual redirect',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const setting = await db.setting.upsert({
            where: {
                key
            },
            update: {
                value: JSON.stringify(redirectData)
            },
            create: {
                key,
                value: JSON.stringify(redirectData)
            }
        });
        await logAudit('create', 'Redirect', setting.id, `Created redirect /${cleanSource} -> ${target}`);
        return NextResponse.json({
            success: true,
            redirect: redirectData
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
