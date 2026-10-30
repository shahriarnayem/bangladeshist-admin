'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { WordpressEditor } from '@/components/shared/WordpressEditor';
import { SeoTracker } from '@/components/shared/SeoTracker';
export default function NewStaticPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [showInHeader, setShowInHeader] = useState(false);
    const [showInFooter, setShowInFooter] = useState(true);
    const [saving, setSaving] = useState(false);

    // SEO States
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [ogImage, setOgImage] = useState('');
    const handleTitleChange = (val)=>{
        setTitle(val);
        const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setSlug(generated);
    };
    const handleSave = async (e)=>{
        if (e) e.preventDefault();
        if (!title.trim() || !slug.trim()) {
            toast.error('Page title and slug are required');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    excerpt: excerpt.trim() || null,
                    content: content.trim(),
                    isPublished,
                    showInHeader,
                    showInFooter,
                    metaTitle: metaTitle.trim() || null,
                    metaDescription: metaDescription.trim() || null,
                    canonicalUrl: canonicalUrl.trim() || null,
                    keywords: keywords.trim() || null,
                    ogImage: ogImage.trim() || null
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Static institutional page published to MongoDB');
                router.push('/dashboard/pages');
            } else {
                toast.error(data.error || 'Failed to publish page');
            }
        } catch  {
            toast.error('Network error publishing page');
        } finally{
            setSaving(false);
        }
    };
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={()=>router.push('/dashboard/pages')} className="size-8">
            <ArrowLeft className="size-4"/>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Institutional Page</h1>
            <p className="text-sm text-muted-foreground">
              Draft official governance, ethics, editorial policy, or static information documents with WordPress-style formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={()=>router.push('/dashboard/pages')} className="text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 text-xs font-medium">
            {saving ? <Loader2 className="size-3.5 animate-spin"/> : <Save className="size-3.5"/>}
            Publish Page
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        { /* Main Editor (2 cols) */ }
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
                <Label className="text-xs font-semibold">Page Title *</Label>
                <Input placeholder="e.g. Editorial Standards & Fact-Checking Code" value={title} onChange={(e)=>handleTitleChange(e.target.value)} className="text-sm font-semibold" required/>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">URL Slug</Label>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-muted-foreground">https://thechronicle.press/</span>
                  <Input placeholder="editorial-standards" value={slug} onChange={(e)=>setSlug(e.target.value)} className="font-mono text-xs flex-1"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Brief Summary / Excerpt</Label>
                <Textarea rows={2} placeholder="Summary of this institutional page..." value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} className="text-xs resize-none"/>
              </div>
            </CardContent>
          </Card>

          { /* WordPress-Style Visual WYSIWYG & Broadsheet Editor */ }
          <WordpressEditor value={content} onChange={setContent} placeholder="Draft institutional page body with headings, tables, links, and media..." minHeight="480px"/>

          { /* Institutional Page SEO & Google SERP Tracker */ }
          <SeoTracker
            title={title}
            slug={slug}
            summary={excerpt}
            content={content}
            isPage={true}
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
                  <div className="text-[11px] text-muted-foreground">Make publicly accessible.</div>
                </div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished}/>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Display in Header Nav</div>
                  <div className="text-[11px] text-muted-foreground">Add to top navigation menu.</div>
                </div>
                <Switch checked={showInHeader} onCheckedChange={setShowInHeader}/>
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

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">SEO & Meta Tags</CardTitle>
              <CardDescription className="text-xs">
                Search engine snippets for this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Meta Title</Label>
                <Input placeholder={title ? `${title} — The Chronicle` : 'Page Title — The Chronicle'} className="text-xs"/>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Meta Description</Label>
                <Textarea rows={3} placeholder="Search engine summary..." className="text-xs"/>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
