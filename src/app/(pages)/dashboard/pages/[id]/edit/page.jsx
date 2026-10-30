'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { WordpressEditor } from '@/components/shared/WordpressEditor';
export default function EditStaticPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const pageId = resolvedParams.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [showInFooter, setShowInFooter] = useState(true);
    useEffect(()=>{
        async function fetchPage() {
            setLoading(true);
            try {
                const res = await fetch(`/api/pages/${pageId}`);
                const data = await res.json();
                if (data.success && data.page) {
                    const p1 = data.page;
                    setTitle(p1.title || '');
                    setSlug(p1.slug || '');
                    setExcerpt(p1.excerpt || '');
                    setContent(p1.content || '');
                    setIsPublished(p1.status === 'PUBLISHED');
                    setShowInFooter(Boolean(p1.showInFooter));
                } else {
                    toast.error(data.error || 'Page not found');
                }
            } catch  {
                toast.error('Network error loading static page');
            } finally{
                setLoading(false);
            }
        }
        fetchPage();
    }, [
        pageId
    ]);
    const handleSave = async (e)=>{
        if (e) e.preventDefault();
        if (!title.trim() || !slug.trim()) {
            toast.error('Title and slug are required');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    excerpt: excerpt.trim() || null,
                    content: content.trim(),
                    isPublished,
                    showInFooter
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Static page updated in database');
                router.push('/dashboard/pages');
            } else {
                toast.error(data.error || 'Failed to update page');
            }
        } catch  {
            toast.error('Network error saving page');
        } finally{
            setSaving(false);
        }
    };
    const handleDelete = async ()=>{
        if (!confirm(`Delete page "${title}"?`)) return;
        try {
            setDeleting(true);
            const res = await fetch(`/api/pages/${pageId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Page deleted');
                router.push('/dashboard/pages');
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch  {
            toast.error('Error deleting page');
        } finally{
            setDeleting(false);
        }
    };
    if (loading) {
        return <div className="py-24 text-center space-y-3">
        <RefreshCw className="mx-auto size-6 animate-spin text-muted-foreground"/>
        <p className="text-xs text-muted-foreground">Loading static page from MongoDB...</p>
      </div>;
    }
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={()=>router.push('/dashboard/pages')} className="size-8">
            <ArrowLeft className="size-4"/>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Edit Institutional Page</h1>
              <Badge variant="outline" className="font-mono text-xs uppercase">
                {pageId}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Modify official newsroom policy and compliance document content with WordPress-style formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && <a href={`https://thechronicle.press/${slug}`} target="_blank" rel="noreferrer" className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'text-xs'
    })}>
              <Eye className="mr-1 size-3.5"/> View Public
            </a>}
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting} className="text-xs text-destructive hover:bg-destructive/10">
            <Trash2 className="mr-1 size-3.5"/> {deleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 text-xs font-medium">
            {saving ? <Loader2 className="size-3.5 animate-spin"/> : <Save className="size-3.5"/>}
            {saving ? 'Saving...' : 'Update Page'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        { /* Main Content (2 cols) */ }
        <div className="space-y-6 lg:col-span-2">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Page Details</CardTitle>
              <CardDescription className="text-xs">
                Title, permalink slug, and summary deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Page Title</Label>
                <Input value={title} onChange={(e)=>setTitle(e.target.value)} className="text-sm font-semibold"/>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">URL Slug</Label>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-muted-foreground">https://thechronicle.press/</span>
                  <Input value={slug} onChange={(e)=>setSlug(e.target.value)} className="font-mono text-xs flex-1"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Summary / Excerpt</Label>
                <Textarea rows={2} value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} className="text-xs resize-none"/>
              </div>
            </CardContent>
          </Card>

          { /* WordPress-Style Markdown & Visual Broadsheet Editor */ }
          <WordpressEditor value={content} onChange={setContent} placeholder="Edit institutional page content..." minHeight="480px"/>
        </div>

        { /* Right Column: Settings & Placement */ }
        <div className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Placement & Visibility</CardTitle>
              <CardDescription className="text-xs">
                Where this page appears across the site navigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Publish Status</div>
                  <div className="text-[11px] text-muted-foreground">Publicly accessible.</div>
                </div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished}/>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Display in Footer Links</div>
                  <div className="text-[11px] text-muted-foreground">Add to bottom institutional columns.</div>
                </div>
                <Switch checked={showInFooter} onCheckedChange={setShowInFooter}/>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
