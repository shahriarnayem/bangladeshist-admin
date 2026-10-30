'use client';
import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeftIcon,
    SaveIcon,
    SparklesIcon,
    Loader2Icon,
    Trash2Icon,
    RefreshCwIcon,
    ExternalLinkIcon,
    PlusIcon,
    XIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { WordpressEditor } from '@/components/shared/WordpressEditor';
import { buildCategoryTree } from '@/lib/taxonomy';

export default function EditArticlePage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const articleId = resolvedParams.id;

    // Loading & submit states
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('PUBLISHED');
    const [isBreaking, setIsBreaking] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [source, setSource] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [authorId, setAuthorId] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');

    // Initial load
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [articleRes, catsRes, tagsRes] = await Promise.all([
                    fetch(`/api/articles/${articleId}`),
                    fetch('/api/categories'),
                    fetch('/api/tags')
                ]);

                if (catsRes.ok) {
                    const cData = await catsRes.json();
                    if (cData.categories) setCategories(cData.categories);
                }

                if (tagsRes.ok) {
                    const tData = await tagsRes.json();
                    if (tData.tags) setAvailableTags(tData.tags);
                }

                if (articleRes.ok) {
                    const aData = await articleRes.json();
                    if (aData.success && aData.article) {
                        const a1 = aData.article;
                        setTitle(a1.title || '');
                        setSlug(a1.slug || '');
                        setSummary(a1.summary || '');
                        setContent(a1.content || '');
                        setStatus(a1.status || 'PUBLISHED');
                        setIsBreaking(Boolean(a1.isBreaking));
                        setIsFeatured(Boolean(a1.isFeatured));
                        setFeaturedImage(a1.featuredImage || '');
                        setCategoryId(a1.categoryId || '');
                        setAuthorId(a1.authorId || '');
                        setSource(a1.source || '');
                        if (Array.isArray(a1.tags)) {
                            setTags(a1.tags.map((t) => t.name));
                        }
                    } else {
                        toast.error(aData.error || 'Article not found');
                    }
                }
            } catch {
                toast.error('Network error loading article details');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [articleId]);

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

    // Update Article
    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!title.trim()) {
            toast.error('Article headline is required');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/articles/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    summary: summary.trim(),
                    content: content.trim(),
                    categoryId: categoryId || undefined,
                    authorId: authorId || undefined,
                    source: source.trim() || null,
                    tagNames: tags,
                    status,
                    isBreaking,
                    isFeatured,
                    featuredImage: featuredImage.trim() || null
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Article updated in MongoDB database');
                router.push('/dashboard/articles');
            } else {
                toast.error(data.error || 'Failed to update article');
            }
        } catch {
            toast.error('Network error updating story');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Article
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this article?')) return;
        try {
            setIsDeleting(true);
            const res = await fetch(`/api/articles/${articleId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Article deleted');
                router.push('/dashboard/articles');
            } else {
                toast.error(data.error || 'Failed to delete article');
            }
        } catch {
            toast.error('Network error deleting story');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-24 text-center space-y-3">
                <RefreshCwIcon className="mx-auto size-6 animate-spin text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Loading story from MongoDB...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Top Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/articles')} className="size-8">
                        <ArrowLeftIcon className="size-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Edit Editorial Article</h1>
                            <Badge variant="outline" className="font-mono text-xs uppercase">
                                {articleId}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Modify headline, copy, beat assignment, and publishing metadata with WordPress-style editing.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {slug && (
                        <a
                            href={`https://thechronicle.press/articles/${slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                                className: 'text-xs'
                            })}
                        >
                            <ExternalLinkIcon className="mr-1 size-3.5" /> View Live
                        </a>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-xs text-destructive hover:bg-destructive/10"
                    >
                        <Trash2Icon className="mr-1 size-3.5" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button size="sm" onClick={handleUpdate} disabled={isSubmitting} className="gap-1.5 text-xs font-medium">
                        {isSubmitting ? <Loader2Icon className="size-3.5 animate-spin" /> : <SaveIcon className="size-3.5" />}
                        {isSubmitting ? 'Updating...' : 'Update Story'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Editor Column (2 cols) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Headline & Standfirst */}
                    <Card className="border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Headline & Standfirst</CardTitle>
                            <CardDescription className="text-xs">
                                Draft a compelling headline and deck summary for broadsheet layout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Article Headline *</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter headline..."
                                    className="text-sm font-semibold"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">URL Slug</Label>
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                    <span className="text-muted-foreground">https://thechronicle.press/articles/</span>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="headline-slug"
                                        className="font-mono text-xs flex-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Standfirst / Deck Summary</Label>
                                <Textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Brief synopsis of the report..."
                                    rows={2}
                                    className="text-xs resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* WordPress-Style Markdown & Visual Broadsheet Editor */}
                    <WordpressEditor
                        value={content}
                        onChange={setContent}
                        authorId={authorId}
                        placeholder="Edit story copy with full formatting..."
                        minHeight="480px"
                    />

                    {/* Featured Hero Image with ImagePicker Component */}
                    <Card className="border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Lead Photojournalism Asset (Featured Hero)</CardTitle>
                            <CardDescription className="text-xs">
                                Upload banner photo or select from media library. Maintains uploader attribution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImagePicker
                                value={featuredImage}
                                onChange={setFeaturedImage}
                                currentUserId={authorId}
                                description="Upload via Cloudinary or choose from your media library with role-based permissions."
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar: Editorial Metadata */}
                <div className="space-y-6">
                    <Card className="border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Publishing Parameters</CardTitle>
                            <CardDescription className="text-xs">
                                Beat assignment, source attribution, and distribution flags.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Editorial Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => {
                                        if (val) setStatus(val);
                                    }}
                                >
                                    <SelectTrigger className="text-xs font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLISHED">Published (Live to public)</SelectItem>
                                        <SelectItem value="PENDING_REVIEW">In Desk Review</SelectItem>
                                        <SelectItem value="DRAFT">Draft (Unpublished)</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived / Retracted</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desk / Section Beat */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Desk / Section Beat</Label>
                                <Select
                                    value={categoryId}
                                    onValueChange={(val) => {
                                        if (val) setCategoryId(val);
                                    }}
                                >
                                    <SelectTrigger className="text-xs font-medium">
                                        <SelectValue placeholder="Select Category Beat">
                                            {selectedCategoryLabel || 'Select Category Beat'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {categoryTree.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id}
                                                className={c.depth > 0 ? 'pl-6 text-muted-foreground font-normal' : 'font-semibold text-foreground'}
                                            >
                                                {c.depth > 0 ? `— ${c.name}` : c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

                            {/* Taxonomy Tags */}
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

                            <div className="flex items-center justify-between border-t pt-3">
                                <div className="space-y-0.5">
                                    <div className="text-xs font-semibold">Breaking News Flag</div>
                                    <div className="text-[11px] text-muted-foreground">Broadcast to the top marquee ticker.</div>
                                </div>
                                <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
                            </div>

                            <div className="flex items-center justify-between border-t pt-3">
                                <div className="space-y-0.5">
                                    <div className="text-xs font-semibold">Editor's Spotlight Pick</div>
                                    <div className="text-[11px] text-muted-foreground">Pin to homepage lead grid.</div>
                                </div>
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Studio Quick Actions */}
                    <Card className="border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Social Studio</CardTitle>
                            <CardDescription className="text-xs">
                                Generate shareable graphic assets for this piece.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link
                                href={`/dashboard/photocard?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`}
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'sm',
                                    className: 'w-full justify-start gap-2 text-xs'
                                })}
                            >
                                <SparklesIcon className="size-3.5" />
                                Generate Photocard for Social
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
