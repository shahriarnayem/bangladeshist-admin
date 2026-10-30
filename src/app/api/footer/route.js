import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/api-helper';
const DEFAULT_FOOTER_CONFIG = {
    brandName: 'THE CHRONICLE',
    brandTagline: 'Independent investigative journalism and analytical coverage of global affairs, markets, and technological shifts.',
    copyrightText: '© 2026 The Chronicle Publishing Co. All rights reserved.',
    showBackToTop: true,
    showNewsletterSignup: true,
    newsletterHeading: 'The Morning Dispatch',
    newsletterDescription: 'A concise executive brief of global developments and market intelligence, delivered at dawn.',
    columns: [
        {
            title: 'News Desks',
            links: [
                {
                    label: 'World News',
                    url: '/category/world'
                },
                {
                    label: 'Markets & Capital',
                    url: '/category/business'
                },
                {
                    label: 'Technology',
                    url: '/category/tech'
                },
                {
                    label: 'Governance & Policy',
                    url: '/category/policy'
                },
                {
                    label: 'Opinion & Analysis',
                    url: '/category/opinion'
                },
                {
                    label: 'Science & Environment',
                    url: '/category/science'
                }
            ]
        },
        {
            title: 'The Newsroom',
            links: [
                {
                    label: 'About The Chronicle',
                    url: '/about'
                },
                {
                    label: 'Editorial Standards',
                    url: '/editorial-standards'
                },
                {
                    label: 'Masthead & Staff',
                    url: '/masthead'
                },
                {
                    label: 'Careers & Fellowships',
                    url: '/careers'
                },
                {
                    label: 'Press & Media Inquiries',
                    url: '/press'
                }
            ]
        },
        {
            title: 'Legal & Policies',
            links: [
                {
                    label: 'Privacy Policy',
                    url: '/privacy'
                },
                {
                    label: 'Terms of Service',
                    url: '/terms'
                },
                {
                    label: 'Corrections Policy',
                    url: '/corrections'
                },
                {
                    label: 'Syndication Rights',
                    url: '/syndication'
                },
                {
                    label: 'Security & Whistleblowing',
                    url: '/secure-drop'
                }
            ]
        }
    ],
    socialLinks: {
        twitter: 'https://x.com/thechronicle',
        linkedin: 'https://linkedin.com/company/thechronicle',
        github: 'https://github.com/thechronicle',
        youtube: 'https://youtube.com/@thechronicle',
        rss: '/feed.xml'
    }
};
export async function GET() {
    try {
        const record = await db.setting.findUnique({
            where: {
                key: 'footer_config'
            }
        });
        if (!record || !record.value) {
            return NextResponse.json({
                success: true,
                config: DEFAULT_FOOTER_CONFIG
            });
        }
        try {
            const parsed = JSON.parse(record.value);
            return NextResponse.json({
                success: true,
                config: {
                    ...DEFAULT_FOOTER_CONFIG,
                    ...parsed
                }
            });
        } catch  {
            return NextResponse.json({
                success: true,
                config: DEFAULT_FOOTER_CONFIG
            });
        }
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
        const serialized = JSON.stringify(body);
        await db.setting.upsert({
            where: {
                key: 'footer_config'
            },
            update: {
                value: serialized
            },
            create: {
                key: 'footer_config',
                value: serialized
            }
        });
        await logAudit('update', 'Setting', 'footer_config', 'Updated newsroom Footer layout and column settings');
        return NextResponse.json({
            success: true,
            message: 'Footer layout saved successfully'
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
