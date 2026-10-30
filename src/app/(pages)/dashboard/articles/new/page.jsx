'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SaveIcon, SendIcon, SparklesIcon, Loader2Icon, PlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { WordpressEditor } from '@/components/shared/WordpressEditor';
import { SeoTracker } from '@/components/shared/SeoTracker';
import { CategoryMultiSelector, buildCategoryTree } from '@/components/shared/CategoryMultiSelector';

export default function NewArticlePage() {
    const router = useRouter();

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [source, setSource] = useState('Staff Reporting');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [featuredImage, setFeaturedImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // SEO Tracker State
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [ogImage, setOgImage] = useState('');

    useEffect(() => {
        async function loadMetadata() {
            try {
                const [catsRes, usersRes, tagsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/users'),
                    fetch('/api/tags')
                ]);
                if (catsRes.ok) {
                    const cData = await catsRes.json();
                    if (cData.categories && cData.categories.length > 0) {
                        setCategories(cData.categories);
                        setCategoryId(cData.categories[0].id);
                        setCategoryIds([cData.categories[0].id]);
                    }
                }
                if (usersRes.ok) {
                    const uData = await usersRes.json();
                    if (uData.users && uData.users.length > 0) {
                        setCurrentUser(uData.users[0]);
                    }
                }
                if (tagsRes.ok) {
                    const tData = await tagsRes.json();
                    if (tData.tags) {
                        setAvailableTags(tData.tags);
                    }
                }
            } catch {
                // Fallback
            }
        }
        loadMetadata();
    }, []);

    // Hierarchical category tree (children directly beneath parents)
    const categoryTree = useMemo(() => {
        return buildCategoryTree(categories);
    }, [categories]);

    // Active category label display (parent -> child or root name)
    const selectedCategory = useMemo(() => {
        return categoryTree.find((c) => c.id === categoryId) || categories.find((c) => c.id === categoryId);
    }, [categoryTree, categories, categoryId]);

    const selectedCategoryLabel = useMemo(() => {
        if (!selectedCategory) return '';
        if (selectedCategory.parentName) {
            return `${selectedCategory.parentName} → ${selectedCategory.name}`;
        }
        if (selectedCategory.parent?.name) {
            return `${selectedCategory.parent.name} → ${selectedCategory.name}`;
        }
        return selectedCategory.name;
    }, [selectedCategory]);

    const handleTitleChange = (val) => {
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
    };

    const handleAddTag = (tagToAdd) => {
        const clean = (tagToAdd || tagInput).trim().replace(/^[#,]+/, '');
        if (!clean) return;
        if (!tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
            setTags((prev) => [...prev, clean]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags((prev) => prev.filter((t) => t !== tagToRemove));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSave = async (status) => {
        if (!title.trim()) {
            toast.error('Article headline is required');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    summary: summary.trim(),
                    content: content.trim(),
                    categoryId: categoryId || (categoryIds.length > 0 ? categoryIds[0] : undefined),
                    categoryIds: categoryIds,
                    authorId: currentUser?.id || undefined,
                    source: source.trim() || null,
                    tagNames: tags,
                    status,
                    featuredImage: featuredImage.trim() || null,
                    metaTitle: metaTitle.trim() || null,
                    metaDescription: metaDescription.trim() || null,
                    canonicalUrl: canonicalUrl.trim() || null,
                    keywords: keywords.trim() || null,
                    ogImage: ogImage.trim() || null
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Story ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} in MongoDB`);
                router.push('/dashboard/articles');
            } else {
                toast.error(data.error || 'Failed to save article');
            }
        } catch {
            toast.error('Network error saving story');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='space-y-6 pb-12'>
            {/* Top Header */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
                <div className='flex items-center gap-3'>
                    <Button variant='outline' size='icon' className='size-8' onClick={() => router.push('/dashboard/articles')}>
                        <ArrowLeftIcon className='size-4' />
                    </Button>
                    <div>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-2xl font-bold tracking-tight'>Draft Editorial Article</h1>
                            <Badge variant='outline' className='text-xs'>
                                Newsroom Desk
                            </Badge>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                            WordPress-style editorial composer with live broadsheet preview, tables, and media library insertion.
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' disabled={isSubmitting} onClick={() => handleSave('DRAFT')} className='gap-1.5 text-xs font-medium'>
                        <SaveIcon className='size-3.5' /> Save Draft
                    </Button>
                    <Button size='sm' disabled={isSubmitting} onClick={() => handleSave('PUBLISHED')} className='gap-1.5 text-xs font-medium'>
                        {isSubmitting ? <Loader2Icon className='size-3.5 animate-spin' /> : <SendIcon className='size-3.5' />}
                        Publish to Wire
                    </Button>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Main Editor Column (2 cols) */}
                <div className='space-y-6 lg:col-span-2'>
                    {/* Article Identity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Headline & Standfirst</CardTitle>
                            <CardDescription>
                                Craft an engaging editorial headline and concise deck for reader previews.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title'>Article Headline *</Label>
                                <Input
                                    id='title'
                                    placeholder='e.g., Central Banks Convene Emergency Liquidity Summit'
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className='text-base font-semibold'
                                    required
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='slug'>Permalink Slug</Label>
                                <div className='flex items-center gap-1.5 font-mono text-xs text-muted-foreground'>
                                    <span>/articles/</span>
                                    <Input
                                        id='slug'
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder='central-banks-convene-summit'
                                        className='font-mono text-xs flex-1'
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='summary'>Standfirst / Deck Summary</Label>
                                <Textarea
                                    id='summary'
                                    placeholder='A concise 2-sentence deck introducing the core premise...'
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={2}
                                    className='text-xs resize-none'
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Full WordPress-Style Visual WYSIWYG & Broadsheet Editor */}
                    <WordpressEditor
                        value={content}
                        onChange={setContent}
                        authorId={currentUser?.id}
                        placeholder="Draft the story copy here with headings, citations, blockquotes, and media..."
                        minHeight="480px"
                    />

                    {/* Newsroom SEO & Google SERP Tracker */}
                    <SeoTracker
                        title={title}
                        slug={slug}
                        summary={summary}
                        content={content}
                        featuredImage={featuredImage}
                        categoryName={selectedCategory?.name}
                        authorId={currentUser?.id}
                        metaTitle={metaTitle}
                        onMetaTitleChange={setMetaTitle}
                        metaDescription={metaDescription}
                        onMetaDescriptionChange={setMetaDescription}
                        keywords={keywords}
                        onKeywordsChange={setKeywords}
                        canonicalUrl={canonicalUrl}
                        onCanonicalUrlChange={setCanonicalUrl}
                        ogImage={ogImage}
                        onOgImageChange={setOgImage}
                    />
                </div>

                {/* Sidebar Settings Column */}
                <div className='space-y-6'>
                    {/* Editorial Metadata */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Editorial Metadata</CardTitle>
                            <CardDescription className="text-xs">
                                Classification, attribution, and taxonomy tags.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Desk / Section Beat & Categories (Multi-select + Inline Add) */}
                            <div className='space-y-1.5'>
                                <Label className="text-xs font-semibold">Editorial Desk & Categories</Label>
                                <CategoryMultiSelector
                                    categories={categories}
                                    selectedIds={categoryIds}
                                    primaryId={categoryId}
                                    onChange={({ categoryIds: nextIds, primaryId: nextPrimary }) => {
                                        setCategoryIds(nextIds);
                                        setCategoryId(nextPrimary);
                                    }}
                                    onCategoryCreated={(newCat) => {
                                        setCategories((prev) => [newCat, ...prev]);
                                    }}
                                />
                            </div>

                            {/* Article Source / Wire Agency */}
                            <div className='space-y-1.5'>
                                <Label htmlFor='source' className="text-xs font-semibold">Article Source / Wire Agency</Label>
                                <Input
                                    id='source'
                                    placeholder='e.g., Staff Reporting, Reuters, AP'
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className='text-xs h-9'
                                />
                            </div>

                            {/* Taxonomy Tags & Keywords */}
                            <div className='space-y-2 border-t pt-3'>
                                <div className='flex items-center justify-between'>
                                    <Label className="text-xs font-semibold">Taxonomy Tags</Label>
                                    <span className='text-[10px] text-muted-foreground'>Press Enter or comma</span>
                                </div>

                                <div className='flex items-center gap-1.5'>
                                    <Input
                                        placeholder='Add tag (e.g. Markets, Policy)...'
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className='text-xs h-8 flex-1'
                                    />
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        className='h-8 px-2.5 text-xs'
                                        onClick={() => handleAddTag()}
                                        disabled={!tagInput.trim()}
                                    >
                                        <PlusIcon className='size-3 mr-1' /> Add
                                    </Button>
                                </div>

                                {tags.length > 0 && (
                                    <div className='flex flex-wrap gap-1.5 pt-1'>
                                        {tags.map((t) => (
                                            <Badge
                                                key={t}
                                                variant='secondary'
                                                className='text-[11px] gap-1 pl-2 pr-1 py-0.5 font-normal'
                                            >
                                                {t}
                                                <button
                                                    type='button'
                                                    onClick={() => handleRemoveTag(t)}
                                                    className='rounded hover:bg-muted p-0.5 transition-colors'
                                                    aria-label={`Remove tag ${t}`}
                                                >
                                                    <XIcon className='size-3 leading-none' />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {availableTags.length > 0 && (
                                    <div className='space-y-1 pt-1'>
                                        <div className='text-[10px] text-muted-foreground uppercase tracking-wider font-semibold'>
                                            Quick Add
                                        </div>
                                        <div className='flex flex-wrap gap-1 max-h-24 overflow-y-auto'>
                                            {availableTags
                                                .filter((at) => !tags.some((t) => t.toLowerCase() === at.name.toLowerCase()))
                                                .slice(0, 10)
                                                .map((at) => (
                                                    <button
                                                        key={at.id}
                                                        type='button'
                                                        onClick={() => handleAddTag(at.name)}
                                                        className='text-[11px] px-2 py-0.5 rounded border border-border/60 bg-muted/40 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
                                                    >
                                                        + {at.name}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Featured Hero Media with ImagePicker Component */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Lead Photojournalism Asset</CardTitle>
                            <CardDescription className="text-xs">
                                Upload banner photo or select from media library.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImagePicker
                                value={featuredImage}
                                onChange={setFeaturedImage}
                                currentUserId={currentUser?.id}
                                description="Upload via Cloudinary or select from media library maintaining uploader attribution."
                            />
                        </CardContent>
                    </Card>

                    {/* Creative Studio */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className='text-sm font-semibold flex items-center gap-2'>
                                <SparklesIcon className='size-3.5' /> Social Studio
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Create shareable graphic assets for this piece.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link
                                href={`/dashboard/photocard?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`}
                                className={buttonVariants({
                                    variant: 'outline',
                                    className: 'w-full text-xs font-medium'
                                })}
                            >
                                Generate Social Photocard
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
