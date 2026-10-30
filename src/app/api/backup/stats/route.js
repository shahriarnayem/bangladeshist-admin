import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
    try {
        const [articles, categories, tags, users, settings, media, comments, polls] = await Promise.all([
            db.article.count(),
            db.category.count(),
            db.tag.count(),
            db.user.count(),
            db.setting.count(),
            db.media.count(),
            db.comment.count(),
            db.poll.count()
        ]);
        return NextResponse.json({
            success: true,
            stats: {
                articles,
                categories,
                tags,
                users,
                settings,
                media,
                comments,
                polls,
                totalEntities: articles + categories + tags + users + settings + media + comments + polls
            }
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
