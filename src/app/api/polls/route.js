import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const polls = await db.poll.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });
        const parsedPolls = polls.map((p)=>{
            let options = [];
            let votes = {};
            try {
                options = JSON.parse(p.options || '[]');
            } catch  {
                options = [];
            }
            try {
                votes = JSON.parse(p.votes || '{}');
            } catch  {
                votes = {};
            }
            const totalVotes = Object.values(votes).reduce((a, b)=>a + Number(b), 0);
            return {
                id: p.id,
                question: p.question,
                options,
                votes,
                totalVotes,
                isActive: p.isActive,
                createdAt: p.createdAt.toISOString()
            };
        });
        return NextResponse.json({
            success: true,
            polls: parsedPolls
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
        const { question, options } = body;
        if (!question || !question.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Poll question is required'
            }, {
                status: 400
            });
        }
        const cleanOptions = Array.isArray(options) ? options.map((o)=>String(o).trim()).filter(Boolean) : [];
        if (cleanOptions.length < 2) {
            return NextResponse.json({
                success: false,
                error: 'At least 2 options are required'
            }, {
                status: 400
            });
        }
        const initialVotes = {};
        cleanOptions.forEach((_, idx)=>{
            initialVotes[idx] = 0;
        });
        const poll = await db.poll.create({
            data: {
                question: question.trim(),
                options: JSON.stringify(cleanOptions),
                votes: JSON.stringify(initialVotes),
                isActive: true
            }
        });
        await logAudit('create', 'Poll', poll.id, `Created reader opinion poll "${poll.question}"`);
        return NextResponse.json({
            success: true,
            poll
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
