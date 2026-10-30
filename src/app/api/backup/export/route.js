import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
export async function GET() {
    try {
        const [articles, categories, tags, pages, users, ads, menus, settings, polls] = await Promise.all([
            db.article.findMany({
                take: 200
            }),
            db.category.findMany(),
            db.tag.findMany({
                take: 500
            }),
            db.page.findMany(),
            db.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    isVerified: true,
                    isBanned: true
                }
            }),
            db.ad.findMany(),
            db.menu.findMany(),
            db.setting.findMany(),
            db.poll.findMany()
        ]);
        const dump = {
            meta: {
                app: 'The Chronicle Newsroom CMS',
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                counts: {
                    articles: articles.length,
                    categories: categories.length,
                    tags: tags.length,
                    pages: pages.length,
                    users: users.length,
                    ads: ads.length,
                    menus: menus.length,
                    settings: settings.length,
                    polls: polls.length
                }
            },
            data: {
                articles,
                categories,
                tags,
                pages,
                users,
                ads,
                menus,
                settings,
                polls
            }
        };
        await logAudit('export', 'Backup', 'full-dump', 'Generated full JSON database backup dump');
        return new Response(JSON.stringify(dump, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="thechronicle-dump-${new Date().toISOString().slice(0, 10)}.json"`
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
