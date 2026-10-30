'use client';
import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SaveIcon, SparklesIcon, Loader2Icon, Trash2Icon, RefreshCwIcon, ExternalLinkIcon } from 'lucide-react';
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
    const [authorId, setAuthorId] = useState('');
    const [authors, setAuthors] = useState([]);
    // Featured Hero Image
    const [featuredImage, setFeaturedImage] = useState('');
    // Initial load
    useEffect(()=>{
        async function loadData() {
            setLoading(true);
            try {
                const [articleRes, catsRes, usersRes] = await Promise.all([
                    fetch(`/api/articles/${articleId}`),
                    fetch('/api/categories'),
                    fetch('/api/users')
                ]);
                if (catsRes.ok) {
                    const cData = await catsRes.json();
                    if (cData.categories) setCategories(cData.categories);
                }
                if (usersRes.ok) {
                    const uData = await usersRes.json();
                    if (uData.users) setAuthors(uData.users);
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
                    } else {
                        toast.error(aData.error || 'Article not found');
                    }
                }
            } catch  {
                toast.error('Network error loading article details');
            } finally{
                setLoading(false);
            }
        }
        loadData();
    }, [
        articleId
    ]);
    // Hierarchical category tree (children directly beneath parents)
    const categoryTree = useMemo(() => {
        return buildCategoryTree(categories);
    }, [categories]);

    // Update Article
    const handleUpdate = async (e)=>{
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
        } catch  {
            toast.error('Network error updating story');
        } finally{
            setIsSubmitting(false);
        }
    };
    // Delete Article
    const handleDelete = async ()=>{
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
        } catch  {
            toast.error('Network error deleting story');
        } finally{
            setIsDeleting(false);
        }
    };
    if (loading) {
        return <div className="py-24 text-center space-y-3">
        <RefreshCwIcon className="mx-auto size-6 animate-spin text-muted-foreground"/>
        <p className="text-xs text-muted-foreground">Loading story from MongoDB...</p>
      </div>;
    }
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={()=>router.push('/dashboard/articles')} className="size-8">
            <ArrowLeftIcon className="size-4"/>
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
          {slug && <a href={`https://thechronicle.press/articles/${slug}`} target="_blank" rel="noreferrer" className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'text-xs'
    })}>
              <ExternalLinkIcon className="mr-1 size-3.5"/> View Live
            </a>}
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting} className="text-xs text-destructive hover:bg-destructive/10">
            <Trash2Icon className="mr-1 size-3.5"/>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button size="sm" onClick={handleUpdate} disabled={isSubmitting} className="gap-1.5 text-xs font-medium">
            {isSubmitting ? <Loader2Icon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            {isSubmitting ? 'Updating...' : 'Update Story'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        { /* Main Editor Column (2 cols) */ }
        <div className="space-y-6 lg:col-span-2">
          { /* Headline & Standfirst */ }
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
                <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter headline..." className="text-sm font-semibold" required/>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">URL Slug</Label>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-muted-foreground">https://thechronicle.press/articles/</span>
                  <Input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="headline-slug" className="font-mono text-xs flex-1"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Standfirst / Deck Summary</Label>
                <Textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Brief synopsis of the report..." rows={2} className="text-xs resize-none"/>
              </div>
            </CardContent>
          </Card>

          { /* WordPress-Style Markdown & Visual Broadsheet Editor */ }
          <WordpressEditor value={content} onChange={setContent} authorId={authorId} placeholder="Edit story copy with full formatting..." minHeight="480px"/>

          { /* Featured Hero Image with ImagePicker Component */ }
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Lead Photojournalism Asset (Featured Hero)</CardTitle>
              <CardDescription className="text-xs">
                Upload banner photo or select from media library. Maintains uploader attribution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImagePicker value={featuredImage} onChange={setFeaturedImage} currentUserId={authorId} description="Upload via Cloudinary or choose from your media library with role-based permissions."/>
            </CardContent>
          </Card>
        </div>

        { /* Right Sidebar: Editorial Metadata */ }
        <div className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Publishing Parameters</CardTitle>
              <CardDescription className="text-xs">
                Beat assignment, author byline, and distribution flags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Editorial Status</Label>
                <Select value={status} onValueChange={(val)=>{
        if (val) setStatus(val);
    }}>
                  <SelectTrigger className="text-xs font-medium">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published (Live to public)</SelectItem>
                    <SelectItem value="PENDING_REVIEW">In Desk Review</SelectItem>
                    <SelectItem value="DRAFT">Draft (Unpublished)</SelectItem>
                    <SelectItem value="ARCHIVED">Archived / Retracted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Desk / Section Beat</Label>
                <Select value={categoryId} onValueChange={(val)=>{
        if (val) setCategoryId(val);
    }}>
                  <SelectTrigger className="text-xs font-medium">
                    <SelectValue placeholder="Select Category"/>
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {categoryTree.map((c)=><SelectItem
                        key={c.id}
                        value={c.id}
                        className={c.depth > 0 ? "pl-6 text-muted-foreground font-normal" : "font-semibold text-foreground"}
                      >
                        {c.depth > 0 ? `— ${c.name}` : c.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Author / Byline</Label>
                <Select value={authorId} onValueChange={(val)=>{
        if (val) setAuthorId(val);
    }}>
                  <SelectTrigger className="text-xs font-medium">
                    <SelectValue placeholder="Select Author"/>
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((u)=><SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Breaking News Flag</div>
                  <div className="text-[11px] text-muted-foreground">Broadcast to the top marquee ticker.</div>
                </div>
                <Switch checked={isBreaking} onCheckedChange={setIsBreaking}/>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Editor's Spotlight Pick</div>
                  <div className="text-[11px] text-muted-foreground">Pin to homepage lead grid.</div>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured}/>
              </div>
            </CardContent>
          </Card>

          { /* Studio Quick Actions */ }
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Social Studio</CardTitle>
              <CardDescription className="text-xs">
                Generate shareable graphic assets for this piece.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/photocard?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`} className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'w-full justify-start gap-2 text-xs'
    })}>
                <SparklesIcon className="size-3.5"/>
                Generate Photocard for Social
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
