'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SaveIcon, SendIcon, SparklesIcon, Loader2Icon } from 'lucide-react';
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
import { buildCategoryTree } from '@/lib/taxonomy';
export default function NewArticlePage() {
    const router = useRouter();
    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [authorId, setAuthorId] = useState('');
    const [authors, setAuthors] = useState([]);
    const [featuredImage, setFeaturedImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(()=>{
        async function loadMetadata() {
            try {
                const [catsRes, usersRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/users')
                ]);
                if (catsRes.ok) {
                    const cData = await catsRes.json();
                    if (cData.categories && cData.categories.length > 0) {
                        setCategories(cData.categories);
                        setCategoryId(cData.categories[0].id);
                    }
                }
                if (usersRes.ok) {
                    const uData = await usersRes.json();
                    if (uData.users && uData.users.length > 0) {
                        setAuthors(uData.users);
                        setAuthorId(uData.users[0].id);
                    }
                }
            } catch  {
            // Fallback
            }
        }
        loadMetadata();
    }, []);

    // Hierarchical category tree (children directly beneath parents)
    const categoryTree = useMemo(() => {
        return buildCategoryTree(categories);
    }, [categories]);
    const handleTitleChange = (val)=>{
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
    };
    const handleSave = async (status)=>{
        if (!title.trim()) {
            toast.error('Article title is required');
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
                    categoryId: categoryId || undefined,
                    authorId: authorId || undefined,
                    status,
                    featuredImage: featuredImage.trim() || null
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Story ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} in MongoDB`);
                router.push('/dashboard/articles');
            } else {
                toast.error(data.error || 'Failed to save article');
            }
        } catch  {
            toast.error('Network error saving story');
        } finally{
            setIsSubmitting(false);
        }
    };
    return <div className='space-y-6 pb-12'>
      { /* Top Header */ }
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' className='size-8' onClick={()=>router.push('/dashboard/articles')}>
            <ArrowLeftIcon className='size-4'/>
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
          <Button variant='outline' size='sm' disabled={isSubmitting} onClick={()=>handleSave('DRAFT')} className='gap-1.5 text-xs font-medium'>
            <SaveIcon className='size-3.5'/> Save Draft
          </Button>
          <Button size='sm' disabled={isSubmitting} onClick={()=>handleSave('PUBLISHED')} className='gap-1.5 text-xs font-medium'>
            {isSubmitting ? <Loader2Icon className='size-3.5 animate-spin'/> : <SendIcon className='size-3.5'/>}
            Publish to Wire
          </Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        { /* Main Editor Column (2 cols) */ }
        <div className='space-y-6 lg:col-span-2'>
          { /* Article Identity */ }
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
                <Input id='title' placeholder='e.g., Central Banks Convene Emergency Liquidity Summit' value={title} onChange={(e)=>handleTitleChange(e.target.value)} className='text-base font-semibold' required/>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>Permalink Slug</Label>
                <div className='flex items-center gap-1.5 font-mono text-xs text-muted-foreground'>
                  <span>/articles/</span>
                  <Input id='slug' value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder='central-banks-convene-summit' className='font-mono text-xs flex-1'/>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='summary'>Standfirst / Deck Summary</Label>
                <Textarea id='summary' placeholder='A concise 2-sentence deck introducing the core premise...' value={summary} onChange={(e)=>setSummary(e.target.value)} rows={2} className='text-xs resize-none'/>
              </div>
            </CardContent>
          </Card>

          { /* Full WordPress-Style Markdown & Visual Broadsheet Editor */ }
          <WordpressEditor value={content} onChange={setContent} authorId={authorId} placeholder="Draft the story copy here with headings, citations, blockquotes, and media..." minHeight="480px"/>
        </div>

        { /* Sidebar Settings Column */ }
        <div className='space-y-6'>
          { /* Classification */ }
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Editorial Metadata</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1.5'>
                <Label className="text-xs font-semibold">Desk / Section Beat</Label>
                <Select value={categoryId} onValueChange={(v)=>{
        if (v) setCategoryId(v);
    }}>
                  <SelectTrigger className='w-full text-xs font-medium'>
                    <SelectValue placeholder='Select category'/>
                  </SelectTrigger>
                  <SelectContent className='max-h-72'>
                    {categoryTree.map((c)=><SelectItem
                        key={c.id}
                        value={c.id}
                        className={c.depth > 0 ? 'pl-6 text-muted-foreground font-normal' : 'font-semibold text-foreground'}
                      >
                        {c.depth > 0 ? `— ${c.name}` : c.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1.5'>
                <Label className="text-xs font-semibold">Author / Byline</Label>
                <Select value={authorId} onValueChange={(v)=>{
        if (v) setAuthorId(v);
    }}>
                  <SelectTrigger className='w-full text-xs font-medium'>
                    <SelectValue placeholder='Select author'/>
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((u)=><SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          { /* Featured Hero Media with ImagePicker Component */ }
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Lead Photojournalism Asset</CardTitle>
              <CardDescription className="text-xs">
                Upload banner photo or select from media library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImagePicker value={featuredImage} onChange={setFeaturedImage} currentUserId={authorId} description="Upload via Cloudinary or select from media library maintaining uploader attribution."/>
            </CardContent>
          </Card>

          { /* Creative Studio */ }
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className='text-sm font-semibold flex items-center gap-2'>
                <SparklesIcon className='size-3.5'/> Social Studio
              </CardTitle>
              <CardDescription className="text-xs">
                Create shareable graphic assets for this piece.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/photocard?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`} className={buttonVariants({
        variant: 'outline',
        className: 'w-full text-xs font-medium'
    })}>
                Generate Social Photocard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
