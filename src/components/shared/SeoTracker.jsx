'use client';
import { useState, useMemo } from 'react';
import {
    Search,
    Globe,
    Share2,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Sparkles,
    Smartphone,
    Monitor,
    HelpCircle,
    Link as LinkIcon,
    FileText,
    ImageIcon,
    ArrowUpRight,
    Copy,
    Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePicker } from './ImagePicker';

export function SeoTracker({
    title = '',
    slug = '',
    summary = '',
    content = '',
    featuredImage = '',
    categoryName = '',
    isPage = false,
    authorId = '',
    metaTitle = '',
    onMetaTitleChange,
    metaDescription = '',
    onMetaDescriptionChange,
    keywords = '',
    onKeywordsChange,
    canonicalUrl = '',
    onCanonicalUrlChange,
    ogImage = '',
    onOgImageChange
}) {
    const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'
    const [activeTab, setActiveTab] = useState('general'); // 'general' | 'preview' | 'audit' | 'social'

    // Compute effective values (with fallbacks)
    const effectiveTitle = (metaTitle || title || (isPage ? 'Static Page Title' : 'Headline Title')).trim();
    const effectiveDesc = (metaDescription || summary || 'Add a compelling meta description to optimize snippet visibility across Google and news aggregators.').trim();
    const effectiveSlug = (slug || 'permalink-slug').trim();
    const effectiveCanonical = (canonicalUrl || `https://thechronicle.press/${effectiveSlug}`).trim();
    const effectiveOgImage = (ogImage || featuredImage || 'https://thechronicle.press/og-default.jpg').trim();

    // Strip HTML from content to evaluate text metrics
    const contentStats = useMemo(() => {
        const plainText = content
            ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            : '';
        const words = plainText ? plainText.split(/\s+/).length : 0;
        const charCount = plainText.length;

        // Subheadings count (H2, H3, H4)
        const h2Matches = (content.match(/<h2[^>]*>/gi) || []).length;
        const h3Matches = (content.match(/<h3[^>]*>/gi) || []).length;
        const subheadingsCount = h2Matches + h3Matches;

        // Image tags count
        const imagesCount = (content.match(/<img[^>]*>/gi) || []).length + (featuredImage ? 1 : 0);
        // Links count
        const linksCount = (content.match(/<a[^>]*>/gi) || []).length;

        return { plainText, words, charCount, subheadingsCount, imagesCount, linksCount };
    }, [content, featuredImage]);

    // Focus keyphrase processing
    const focusKeyword = useMemo(() => {
        if (keywords && keywords.trim()) {
            // First keyword or complete phrase
            return keywords.split(',')[0].trim().toLowerCase();
        }
        return '';
    }, [keywords]);

    // Comprehensive SEO Audit Checks (Yoast & Rank Math Standard)
    const auditResults = useMemo(() => {
        const checks = [];
        let score = 0;
        const maxScore = 100;

        const kw = focusKeyword;
        const kwLower = kw.toLowerCase();
        const titleLower = effectiveTitle.toLowerCase();
        const descLower = effectiveDesc.toLowerCase();
        const slugLower = effectiveSlug.toLowerCase();
        const contentLower = contentStats.plainText.toLowerCase();

        // 1. Focus Keyword Provided
        if (kw) {
            checks.push({
                id: 'kw_present',
                category: 'keyword',
                title: 'Focus Keyphrase defined',
                status: 'pass',
                score: 10,
                message: `Focus keyword "${kw}" is configured for targeted search discoverability.`
            });
            score += 10;
        } else {
            checks.push({
                id: 'kw_present',
                category: 'keyword',
                title: 'Focus Keyphrase missing',
                status: 'fail',
                score: 0,
                message: 'Add a target focus keyphrase to evaluate search engine ranking parameters.'
            });
        }

        // 2. Keyword in SEO Title
        if (kw) {
            if (titleLower.includes(kwLower)) {
                checks.push({
                    id: 'kw_in_title',
                    category: 'keyword',
                    title: 'Focus Keyphrase in SEO Title',
                    status: 'pass',
                    score: 10,
                    message: 'The focus keyphrase appears inside your primary SEO Title tag.'
                });
                score += 10;

                // Keyword near beginning of title?
                if (titleLower.indexOf(kwLower) < 25) {
                    checks.push({
                        id: 'kw_title_start',
                        category: 'keyword',
                        title: 'Keyphrase near title beginning',
                        status: 'pass',
                        score: 5,
                        message: 'The focus keyphrase appears prominently near the start of the headline.'
                    });
                    score += 5;
                } else {
                    checks.push({
                        id: 'kw_title_start',
                        category: 'keyword',
                        title: 'Keyphrase position in title',
                        status: 'warn',
                        score: 2,
                        message: 'Move the focus keyphrase closer to the start of the SEO Title for higher click-throughs.'
                    });
                    score += 2;
                }
            } else {
                checks.push({
                    id: 'kw_in_title',
                    category: 'keyword',
                    title: 'Focus Keyphrase missing from SEO Title',
                    status: 'fail',
                    score: 0,
                    message: 'Include your focus keyphrase in the SEO Title for high search ranking.'
                });
            }
        }

        // 3. SEO Title Length (Recommended 45 - 60 chars)
        const titleLen = effectiveTitle.length;
        if (titleLen >= 45 && titleLen <= 65) {
            checks.push({
                id: 'title_length',
                category: 'title',
                title: 'SEO Title length optimal',
                status: 'pass',
                score: 10,
                message: `Title length is ${titleLen} characters, which fits Google SERP snippet limits without truncation.`
            });
            score += 10;
        } else if (titleLen > 65) {
            checks.push({
                id: 'title_length',
                category: 'title',
                title: 'SEO Title too long',
                status: 'warn',
                score: 4,
                message: `Title is ${titleLen} characters. Google may truncate it after ~60 characters with "...".`
            });
            score += 4;
        } else {
            checks.push({
                id: 'title_length',
                category: 'title',
                title: 'SEO Title too short',
                status: 'warn',
                score: 4,
                message: `Title is ${titleLen} characters. Expanding to 45–60 characters maximizes headline impact.`
            });
            score += 4;
        }

        // 4. Keyword in Meta Description
        if (kw) {
            if (descLower.includes(kwLower)) {
                checks.push({
                    id: 'kw_in_desc',
                    category: 'keyword',
                    title: 'Focus Keyphrase in Meta Description',
                    status: 'pass',
                    score: 10,
                    message: 'Your meta description features the target focus keyphrase.'
                });
                score += 10;
            } else {
                checks.push({
                    id: 'kw_in_desc',
                    category: 'keyword',
                    title: 'Keyphrase missing from Meta Description',
                    status: 'warn',
                    score: 2,
                    message: 'Include the focus keyphrase in your meta description so it highlights in bold in Google results.'
                });
                score += 2;
            }
        }

        // 5. Meta Description Length (Recommended 120 - 160 chars)
        const descLen = effectiveDesc.length;
        if (descLen >= 120 && descLen <= 165) {
            checks.push({
                id: 'desc_length',
                category: 'snippet',
                title: 'Meta Description length optimal',
                status: 'pass',
                score: 10,
                message: `Snippet is ${descLen} characters, optimal for modern mobile and desktop broadsheet cards.`
            });
            score += 10;
        } else if (descLen > 165) {
            checks.push({
                id: 'desc_length',
                category: 'snippet',
                title: 'Meta Description exceeds SERP boundary',
                status: 'warn',
                score: 5,
                message: `Snippet is ${descLen} characters and will be clipped by search crawlers. Keep under 160.`
            });
            score += 5;
        } else {
            checks.push({
                id: 'desc_length',
                category: 'snippet',
                title: 'Meta Description brief',
                status: 'warn',
                score: 5,
                message: `Snippet is only ${descLen} characters. Aim for 120–160 characters to entice reader clicks.`
            });
            score += 5;
        }

        // 6. Keyword in URL Permalink Slug
        if (kw) {
            const normalizedKw = kwLower.replace(/[^a-z0-9]+/g, '-');
            if (slugLower.includes(normalizedKw) || slugLower.includes(kwLower)) {
                checks.push({
                    id: 'kw_in_slug',
                    category: 'architecture',
                    title: 'Focus Keyphrase in URL Slug',
                    status: 'pass',
                    score: 10,
                    message: 'URL slug includes the target focus keyphrase.'
                });
                score += 10;
            } else {
                checks.push({
                    id: 'kw_in_slug',
                    category: 'architecture',
                    title: 'Keyphrase absent from URL slug',
                    status: 'warn',
                    score: 3,
                    message: 'Including keywords in the URL slug improves crawl categorization.'
                });
                score += 3;
            }
        }

        // 7. Keyword in Lead Paragraph / First 100 words
        if (kw) {
            const firstWords = contentLower.split(/\s+/).slice(0, 120).join(' ');
            if (firstWords.includes(kwLower)) {
                checks.push({
                    id: 'kw_in_lead',
                    category: 'content',
                    title: 'Keyphrase in opening lead',
                    status: 'pass',
                    score: 10,
                    message: 'Focus keyphrase appears in the opening lead paragraph of the piece.'
                });
                score += 10;
            } else {
                checks.push({
                    id: 'kw_in_lead',
                    category: 'content',
                    title: 'Keyphrase absent from lead paragraph',
                    status: 'warn',
                    score: 2,
                    message: 'Introduce the focus keyphrase in the opening paragraph to confirm relevance immediately.'
                });
                score += 2;
            }
        }

        // 8. Focus Keyword Density
        if (kw && contentStats.words > 50) {
            const matches = contentLower.split(kwLower).length - 1;
            const density = ((matches * kwLower.split(' ').length) / contentStats.words) * 100;
            const formattedDensity = density.toFixed(1);

            if (density >= 0.8 && density <= 2.8) {
                checks.push({
                    id: 'kw_density',
                    category: 'content',
                    title: `Keyphrase density optimal (${formattedDensity}%)`,
                    status: 'pass',
                    score: 10,
                    message: `Keyphrase appears ${matches} times (${formattedDensity}% density), ideal for editorial reporting.`
                });
                score += 10;
            } else if (density > 2.8) {
                checks.push({
                    id: 'kw_density',
                    category: 'content',
                    title: `Keyphrase density high (${formattedDensity}%)`,
                    status: 'warn',
                    score: 4,
                    message: 'Keyphrase appears too frequently; avoid keyword stuffing to preserve editorial tone.'
                });
                score += 4;
            } else {
                checks.push({
                    id: 'kw_density',
                    category: 'content',
                    title: `Keyphrase density low (${formattedDensity}%)`,
                    status: 'warn',
                    score: 4,
                    message: `Keyphrase appears only ${matches} time(s). Weave it naturally across subheads and body.`
                });
                score += 4;
            }
        }

        // 9. Article Content Journalistic Depth
        const wordCount = contentStats.words;
        const minWords = isPage ? 150 : 300;
        const deepWords = isPage ? 400 : 600;

        if (wordCount >= deepWords) {
            checks.push({
                id: 'word_count',
                category: 'content',
                title: `Journalistic word count (${wordCount} words)`,
                status: 'pass',
                score: 10,
                message: `Story length (${wordCount} words) exceeds high-authority investigative benchmarks.`
            });
            score += 10;
        } else if (wordCount >= minWords) {
            checks.push({
                id: 'word_count',
                category: 'content',
                title: `Sufficient news dispatch length (${wordCount} words)`,
                status: 'pass',
                score: 7,
                message: `Story contains ${wordCount} words, satisfying breaking wire news guidelines.`
            });
            score += 7;
        } else {
            checks.push({
                id: 'word_count',
                category: 'content',
                title: `Thin content warning (${wordCount} words)`,
                status: 'fail',
                score: 2,
                message: `Content has only ${wordCount} words. High-ranking news pieces require at least ${minWords} words.`
            });
            score += 2;
        }

        // 10. Subheadings (H2, H3) Structure
        if (contentStats.subheadingsCount >= 2 || (isPage && contentStats.subheadingsCount >= 1)) {
            checks.push({
                id: 'subheadings',
                category: 'content',
                title: `Subheadings structured (${contentStats.subheadingsCount} found)`,
                status: 'pass',
                score: 5,
                message: 'Story is organized into readable sections with H2/H3 subheadings.'
            });
            score += 5;
        } else {
            checks.push({
                id: 'subheadings',
                category: 'content',
                title: 'Insufficient subheadings',
                status: 'warn',
                score: 1,
                message: 'Add H2 and H3 subheadings to break up copy and improve skimmability for readers.'
            });
            score += 1;
        }

        // 11. Photojournalism & Media
        if (featuredImage || contentStats.imagesCount > 0) {
            checks.push({
                id: 'media_present',
                category: 'media',
                title: `Media assets detected (${contentStats.imagesCount} images)`,
                status: 'pass',
                score: 5,
                message: 'Featured photography is attached for search snippets and rich media carousels.'
            });
            score += 5;
        } else {
            checks.push({
                id: 'media_present',
                category: 'media',
                title: 'No editorial media detected',
                status: 'warn',
                score: 1,
                message: 'Articles with high-resolution lead images rank significantly higher in Google Discover.'
            });
            score += 1;
        }

        // 12. Primary Citations & Outbound Links
        if (contentStats.linksCount > 0) {
            checks.push({
                id: 'links_present',
                category: 'architecture',
                title: `Editorial citations found (${contentStats.linksCount} links)`,
                status: 'pass',
                score: 5,
                message: 'Includes cross-links to authoritative background reporting or official wire sources.'
            });
            score += 5;
        } else {
            checks.push({
                id: 'links_present',
                category: 'architecture',
                title: 'No cross-reference links',
                status: 'warn',
                score: 1,
                message: 'Add internal links to related archive coverage or external links to primary documents.'
            });
            score += 1;
        }

        const clampedScore = Math.min(100, Math.max(0, score));

        let grade = 'needs_improvement';
        let gradeLabel = 'Needs Work';
        let gradeColor = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
        let badgeVariant = 'outline';

        if (clampedScore >= 80) {
            grade = 'good';
            gradeLabel = 'High Authority (Optimized)';
            gradeColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
        } else if (clampedScore < 50) {
            grade = 'poor';
            gradeLabel = 'Poor / Incomplete';
            gradeColor = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
        } else {
            gradeLabel = 'Moderate / Refinement Recommended';
            gradeColor = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
        }

        return {
            score: clampedScore,
            grade,
            gradeLabel,
            gradeColor,
            checks,
            passCount: checks.filter((c) => c.status === 'pass').length,
            warnCount: checks.filter((c) => c.status === 'warn').length,
            failCount: checks.filter((c) => c.status === 'fail').length
        };
    }, [focusKeyword, effectiveTitle, effectiveDesc, effectiveSlug, contentStats, featuredImage, isPage]);

    // Helpers to insert smart tags into SEO Title
    const handleInsertTitleTag = (tag) => {
        let addition = '';
        if (tag === 'headline') addition = title || 'Headline';
        else if (tag === 'sitename') addition = 'The Chronicle';
        else if (tag === 'category') addition = categoryName || 'News';

        const current = metaTitle || '';
        const separator = current.trim() ? ' — ' : '';
        if (onMetaTitleChange) {
            onMetaTitleChange(`${current}${separator}${addition}`);
        }
    };

    // Auto-generate meta description from summary or lead
    const handleAutofillDesc = () => {
        if (summary && summary.trim()) {
            if (onMetaDescriptionChange) onMetaDescriptionChange(summary.trim().slice(0, 160));
        } else if (contentStats.plainText) {
            const firstSentence = contentStats.plainText.split('.')[0] + '.';
            if (onMetaDescriptionChange) onMetaDescriptionChange(firstSentence.slice(0, 160));
        }
    };

    return (
        <Card className="border shadow-xs">
            {/* SEO Header Card */}
            <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-md border bg-background text-foreground shadow-xs">
                            <Search className="size-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">
                                    Newsroom SEO & Search Tracker
                                </CardTitle>
                                <Badge className={`font-mono text-xs font-semibold ${auditResults.gradeColor}`}>
                                    {auditResults.score} / 100
                                </Badge>
                            </div>
                            <CardDescription className="text-xs">
                                Real-time Google Discover & SERP tracker matching WordPress Yoast & Rank Math standards.
                            </CardDescription>
                        </div>
                    </div>

                    {/* Score Bar Summary */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="size-3.5" /> {auditResults.passCount} passed
                        </span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-1 text-amber-500">
                            <AlertCircle className="size-3.5" /> {auditResults.warnCount} warnings
                        </span>
                        {auditResults.failCount > 0 && (
                            <>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1 text-rose-500">
                                    <XCircle className="size-3.5" /> {auditResults.failCount} failed
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Navigation Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-9 p-1 bg-muted/50">
                        <TabsTrigger value="general" className="text-xs font-medium gap-1.5">
                            <Search className="size-3.5" />
                            <span>SEO Metadata</span>
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs font-medium gap-1.5">
                            <Globe className="size-3.5" />
                            <span>Google SERP Preview</span>
                        </TabsTrigger>
                        <TabsTrigger value="social" className="text-xs font-medium gap-1.5">
                            <Share2 className="size-3.5" />
                            <span>Social Card</span>
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="text-xs font-medium gap-1.5">
                            <Sparkles className="size-3.5" />
                            <span>Audit ({auditResults.score}%)</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: SEO METADATA INPUTS */}
                    <TabsContent value="general" className="space-y-5 pt-4">
                        {/* Focus Keyword */}
                        <div className="space-y-2 rounded-lg border p-4 bg-muted/10">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="seo-focus-keyword" className="text-xs font-semibold flex items-center gap-1.5">
                                    <span>Focus Keyphrase / Target Keywords</span>
                                    <HelpCircle className="size-3 text-muted-foreground" title="The primary topic keyword you want this piece to rank for in Google search." />
                                </Label>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    Target Editorial Phrase
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    id="seo-focus-keyword"
                                    placeholder="e.g., Central Bank Liquidity, Foreign Direct Investment"
                                    value={keywords || ''}
                                    onChange={(e) => onKeywordsChange && onKeywordsChange(e.target.value)}
                                    className="text-xs h-9"
                                />
                                {title && !keywords && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const words = title.split(' ').slice(0, 3).join(' ');
                                            if (onKeywordsChange) onKeywordsChange(words);
                                        }}
                                        className="text-xs shrink-0 h-9"
                                    >
                                        Extract from Title
                                    </Button>
                                )}
                            </div>

                            {focusKeyword && (
                                <div className="flex items-center gap-2 text-xs pt-1">
                                    <span className="text-muted-foreground text-[11px]">Primary Evaluated Term:</span>
                                    <Badge variant="secondary" className="font-mono text-[11px]">
                                        {focusKeyword}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* SEO Title Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="seo-meta-title" className="text-xs font-semibold">
                                    SEO Meta Title *
                                </Label>
                                <span className={`text-[11px] font-mono font-medium ${
                                    effectiveTitle.length > 65
                                        ? 'text-rose-500'
                                        : effectiveTitle.length >= 45
                                        ? 'text-emerald-500'
                                        : 'text-amber-500'
                                }`}>
                                    {effectiveTitle.length} / 60 characters
                                </span>
                            </div>

                            <Input
                                id="seo-meta-title"
                                placeholder={title || 'Primary headline optimized for search engines...'}
                                value={metaTitle || ''}
                                onChange={(e) => onMetaTitleChange && onMetaTitleChange(e.target.value)}
                                className="text-xs h-9"
                            />

                            {/* Character Gauge Progress Bar */}
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${
                                        effectiveTitle.length > 65
                                            ? 'bg-rose-500'
                                            : effectiveTitle.length >= 45
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${Math.min(100, (effectiveTitle.length / 60) * 100)}%` }}
                                />
                            </div>

                            {/* Quick Variable Insertion Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                                    Insert:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleInsertTitleTag('headline')}
                                    className="text-[11px] px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-mono"
                                >
                                    + Headline
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInsertTitleTag('category')}
                                    className="text-[11px] px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-mono"
                                >
                                    + Beat
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInsertTitleTag('sitename')}
                                    className="text-[11px] px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-mono"
                                >
                                    + The Chronicle
                                </button>
                            </div>
                        </div>

                        {/* SEO Meta Description */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="seo-meta-desc" className="text-xs font-semibold">
                                    SEO Meta Description Snippet *
                                </Label>
                                <span className={`text-[11px] font-mono font-medium ${
                                    effectiveDesc.length > 165
                                        ? 'text-rose-500'
                                        : effectiveDesc.length >= 120
                                        ? 'text-emerald-500'
                                        : 'text-amber-500'
                                }`}>
                                    {effectiveDesc.length} / 160 characters
                                </span>
                            </div>

                            <Textarea
                                id="seo-meta-desc"
                                placeholder={summary || 'A compelling 1-2 sentence executive briefing enticing reader click-throughs from search engines...'}
                                value={metaDescription || ''}
                                onChange={(e) => onMetaDescriptionChange && onMetaDescriptionChange(e.target.value)}
                                rows={3}
                                className="text-xs resize-none"
                            />

                            {/* Description Gauge Progress Bar */}
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${
                                        effectiveDesc.length > 165
                                            ? 'bg-rose-500'
                                            : effectiveDesc.length >= 120
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${Math.min(100, (effectiveDesc.length / 160) * 100)}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <p className="text-[11px] text-muted-foreground">
                                    Appears beneath your headline in Google search snippets.
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAutofillDesc}
                                    className="text-[11px] h-6 px-2 text-muted-foreground hover:text-foreground"
                                >
                                    Auto-fill from Summary
                                </Button>
                            </div>
                        </div>

                        {/* Canonical URL & Advanced Directives */}
                        <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="seo-canonical" className="text-xs font-semibold flex items-center gap-1.5">
                                    <LinkIcon className="size-3" />
                                    <span>Canonical URL (Self or Syndicated)</span>
                                </Label>
                                <Input
                                    id="seo-canonical"
                                    placeholder={effectiveCanonical}
                                    value={canonicalUrl || ''}
                                    onChange={(e) => onCanonicalUrlChange && onCanonicalUrlChange(e.target.value)}
                                    className="font-mono text-xs h-9"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Leave blank to default to standard canonical permalink.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Structured Data Schema Type
                                </Label>
                                <select
                                    defaultValue={isPage ? 'WebPage' : 'NewsArticle'}
                                    className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {isPage ? (
                                        <>
                                            <option value="WebPage">WebPage (General)</option>
                                            <option value="AboutPage">AboutPage (Institutional)</option>
                                            <option value="ContactPage">ContactPage</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="NewsArticle">NewsArticle (Recommended for Wire)</option>
                                            <option value="AnalysisNewsArticle">AnalysisNewsArticle (Deep Dive)</option>
                                            <option value="OpinionNewsArticle">OpinionNewsArticle (Op-Ed)</option>
                                            <option value="ReviewNewsArticle">ReviewNewsArticle</option>
                                            <option value="Report">Report / Investigation</option>
                                        </>
                                    )}
                                </select>
                                <p className="text-[10px] text-muted-foreground">
                                    Emits valid Schema.org JSON-LD to Google News algorithms.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: GOOGLE SERP SNIPPET PREVIEWS */}
                    <TabsContent value="preview" className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="text-xs text-muted-foreground">
                                Live visual simulation of how this story displays in Google search results.
                            </div>
                            <div className="flex items-center gap-1 rounded-md border p-0.5 bg-muted/40">
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                                        previewDevice === 'mobile'
                                            ? 'bg-background text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Smartphone className="size-3.5" /> Mobile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                                        previewDevice === 'desktop'
                                            ? 'bg-background text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Monitor className="size-3.5" /> Desktop
                                </button>
                            </div>
                        </div>

                        {/* Search Result Card Simulation */}
                        <div className="p-4 sm:p-6 rounded-lg border bg-background space-y-3 font-sans">
                            {/* Breadcrumb row */}
                            <div className="flex items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-full bg-muted border font-bold text-[10px]">
                                    C
                                </div>
                                <div className="text-xs leading-none">
                                    <div className="font-semibold text-foreground">The Chronicle</div>
                                    <div className="text-[11px] text-muted-foreground font-mono truncate max-w-sm">
                                        https://thechronicle.press &gt; {categoryName ? categoryName.toLowerCase().replace(/\s+/g, '-') : 'news'} &gt; {effectiveSlug}
                                    </div>
                                </div>
                            </div>

                            {/* Headline Clickable Link (Google Blue) */}
                            <div>
                                <a
                                    href={`https://thechronicle.press/${effectiveSlug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline leading-snug line-clamp-2"
                                >
                                    {effectiveTitle}
                                </a>
                            </div>

                            {/* Snippet & Date Description */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {featuredImage && previewDevice === 'mobile' && (
                                    <div className="shrink-0 order-last sm:order-first">
                                        <img
                                            src={featuredImage}
                                            alt={effectiveTitle}
                                            className="size-18 object-cover rounded border"
                                        />
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                    <span className="text-foreground/70 font-medium">
                                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —{' '}
                                    </span>
                                    {effectiveDesc}
                                </div>
                            </div>
                        </div>

                        {/* Pixel Width Information */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground bg-muted/20 p-2.5 rounded border">
                            <span>Google Title Pixel Limit: ~580px (Title: {effectiveTitle.length * 9}px est.)</span>
                            <span>Snippet Limit: 960px (~160 chars)</span>
                        </div>
                    </TabsContent>

                    {/* TAB 3: SOCIAL OPEN GRAPH CARD PREVIEW */}
                    <TabsContent value="social" className="space-y-4 pt-4">
                        <div className="text-xs text-muted-foreground pb-2 border-b">
                            OpenGraph & Twitter / X Large Summary Card preview when shared across networks.
                        </div>

                        {/* Social Image Override Option */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">
                                OpenGraph Share Image (Facebook, Twitter / X, LinkedIn)
                            </Label>
                            <ImagePicker
                                value={ogImage || featuredImage}
                                onChange={(url) => onOgImageChange && onOgImageChange(url)}
                                currentUserId={authorId}
                                description="1200×630px recommended for high-resolution retina social feeds."
                            />
                        </div>

                        {/* Social Card Simulation */}
                        <div className="max-w-md mx-auto rounded-xl border border-border/70 overflow-hidden shadow-xs bg-background">
                            <div className="aspect-[1.91/1] w-full bg-muted relative overflow-hidden">
                                {effectiveOgImage ? (
                                    <img
                                        src={effectiveOgImage}
                                        alt={effectiveTitle}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground font-mono">
                                        No Social Image Attached
                                    </div>
                                )}
                            </div>

                            <div className="p-3.5 space-y-1.5 bg-muted/15 border-t">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                    thechronicle.press
                                </div>
                                <div className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
                                    {effectiveTitle}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {effectiveDesc}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 4: REAL-TIME AUDIT CHECKLIST */}
                    <TabsContent value="audit" className="space-y-4 pt-4">
                        {/* Score Overview Box */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-muted/20 gap-3">
                            <div className="space-y-1">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Newsroom Audit Verdict
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {auditResults.gradeLabel}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Evaluated against contemporary Google Search Console, Discover, and schema standards.
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
                                    {auditResults.score}<span className="text-sm text-muted-foreground font-normal">/100</span>
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {auditResults.passCount} of {auditResults.checks.length} criteria satisfied
                                </div>
                            </div>
                        </div>

                        {/* Checklist Items */}
                        <div className="space-y-2">
                            {auditResults.checks.map((check) => (
                                <div
                                    key={check.id}
                                    className="flex items-start gap-3 p-3 rounded-md border bg-card text-card-foreground text-xs transition-colors hover:bg-muted/10"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {check.status === 'pass' ? (
                                            <CheckCircle2 className="size-4 text-emerald-500" />
                                        ) : check.status === 'warn' ? (
                                            <AlertCircle className="size-4 text-amber-500" />
                                        ) : (
                                            <XCircle className="size-4 text-rose-500" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5 flex-1">
                                        <div className="font-semibold text-foreground flex items-center justify-between">
                                            <span>{check.title}</span>
                                            <Badge variant="outline" className="text-[10px] font-mono capitalize">
                                                {check.category}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-xs leading-relaxed">
                                            {check.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
