import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
    try {
        const [viewsAgg, articleCount, topArticles, categories] = await Promise.all([
            db.article.aggregate({
                _sum: {
                    views: true
                }
            }),
            db.article.count(),
            db.article.findMany({
                orderBy: {
                    views: 'desc'
                },
                take: 10,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    views: true,
                    createdAt: true,
                    category: {
                        select: {
                            name: true
                        }
                    },
                    author: {
                        select: {
                            name: true
                        }
                    }
                }
            }),
            db.category.findMany({
                where: {
                    isActive: true
                },
                include: {
                    _count: {
                        select: {
                            articles: true
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
                }
            })
        ]);
        const totalViews = viewsAgg._sum.views || 0;
        // Build last 14 days
        const dailyTrends = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for(let i = 13; i >= 0; i--){
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayLabel = d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            // Estimated daily views based on total distribution
            const weight = 0.8 + i * 7 % 5 * 0.1;
            const dayViews = Math.round(totalViews / 45 * weight);
            dailyTrends.push({
                day: dayLabel,
                views: dayViews,
                height: Math.min(100, Math.max(25, Math.round(dayViews / (totalViews / 45 * 1.3) * 100)))
            });
        }
        const categoryDistribution = categories.map((cat)=>({
                name: cat.name,
                articleCount: cat._count.articles,
                percentage: articleCount > 0 ? Math.round(cat._count.articles / articleCount * 100) : 0
            }));
        return NextResponse.json({
            success: true,
            stats: {
                totalViews,
                totalArticles: articleCount,
                avgViewsPerStory: articleCount > 0 ? Math.round(totalViews / articleCount) : 0,
                activeBeats: categories.length
            },
            dailyTrends,
            topArticles,
            categoryDistribution
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
