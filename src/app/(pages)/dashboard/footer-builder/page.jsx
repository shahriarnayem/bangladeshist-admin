'use client';
import { useState, useEffect } from 'react';
import { SaveIcon, RefreshCwIcon, PlusIcon, Trash2Icon, EyeIcon, ArrowUpIcon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
export default function FooterBuilderPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
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
    });
    useEffect(()=>{
        async function loadConfig() {
            setLoading(true);
            try {
                const res = await fetch('/api/footer');
                const data = await res.json();
                if (data.success && data.config) {
                    setConfig(data.config);
                }
            } catch  {
                toast.error('Failed to load footer configuration');
            } finally{
                setLoading(false);
            }
        }
        loadConfig();
    }, []);
    const handleSave = async ()=>{
        setSaving(true);
        try {
            const res = await fetch('/api/footer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Footer layout saved to MongoDB');
            } else {
                toast.error(data.error || 'Failed to save footer');
            }
        } catch  {
            toast.error('Network error saving footer');
        } finally{
            setSaving(false);
        }
    };
    // Column helpers
    const addColumn = ()=>{
        setConfig((prev)=>({
                ...prev,
                columns: [
                    ...prev.columns,
                    {
                        title: 'New Section',
                        links: [
                            {
                                label: 'Example Link',
                                url: '/'
                            }
                        ]
                    }
                ]
            }));
    };
    const removeColumn = (colIndex)=>{
        setConfig((prev)=>({
                ...prev,
                columns: prev.columns.filter((_, i)=>i !== colIndex)
            }));
    };
    const updateColumnTitle = (colIndex, title)=>{
        const updated = [
            ...config.columns
        ];
        updated[colIndex] = {
            ...updated[colIndex],
            title
        };
        setConfig((prev)=>({
                ...prev,
                columns: updated
            }));
    };
    const addLinkToColumn = (colIndex)=>{
        const updated = [
            ...config.columns
        ];
        updated[colIndex] = {
            ...updated[colIndex],
            links: [
                ...updated[colIndex].links,
                {
                    label: 'New Link',
                    url: '/'
                }
            ]
        };
        setConfig((prev)=>({
                ...prev,
                columns: updated
            }));
    };
    const updateLink = (colIndex, linkIndex, field, value)=>{
        const updated = [
            ...config.columns
        ];
        const updatedLinks = [
            ...updated[colIndex].links
        ];
        updatedLinks[linkIndex] = {
            ...updatedLinks[linkIndex],
            [field]: value
        };
        updated[colIndex] = {
            ...updated[colIndex],
            links: updatedLinks
        };
        setConfig((prev)=>({
                ...prev,
                columns: updated
            }));
    };
    const removeLink = (colIndex, linkIndex)=>{
        const updated = [
            ...config.columns
        ];
        updated[colIndex] = {
            ...updated[colIndex],
            links: updated[colIndex].links.filter((_, i)=>i !== linkIndex)
        };
        setConfig((prev)=>({
                ...prev,
                columns: updated
            }));
    };
    if (loading) {
        return <div className="py-24 text-center space-y-3">
        <RefreshCwIcon className="mx-auto size-6 animate-spin text-muted-foreground"/>
        <p className="text-xs text-muted-foreground">Loading Footer Builder from MongoDB...</p>
      </div>;
    }
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Footer & Legal Builder</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              Global Base
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure multi-column footer navigation, newsletter subscription module, copyright, and legal attribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 text-xs font-medium">
            {saving ? <RefreshCwIcon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            {saving ? 'Saving...' : 'Save Footer Layout'}
          </Button>
        </div>
      </div>

      { /* Live Preview Card */ }
      <Card className="border bg-background shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon className="size-4 text-muted-foreground"/>
            <span className="text-xs font-semibold uppercase tracking-wider">Live Footer Preview</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Editorial Monochrome Broadsheet
          </Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y bg-background text-foreground">
          { /* Newsletter Section */ }
          {config.showNewsletterSignup && <div className="p-6 bg-muted/20 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-serif font-bold text-base tracking-tight flex items-center gap-2">
                  <MailIcon className="size-4"/>
                  {config.newsletterHeading}
                </h4>
                <p className="text-xs text-muted-foreground">{config.newsletterDescription}</p>
              </div>
              <div className="flex items-center gap-2 max-w-sm w-full">
                <Input readOnly placeholder="Enter your email address" className="text-xs bg-background"/>
                <Button size="sm" className="text-xs font-medium shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>}

          { /* Main 4-Column Grid Preview */ }
          <div className="p-8 grid gap-8 md:grid-cols-4 text-xs">
            { /* Brand Column */ }
            <div className="space-y-3 md:col-span-1">
              <h3 className="font-serif text-lg font-black tracking-tight">{config.brandName}</h3>
              <p className="text-muted-foreground leading-relaxed text-[11px]">{config.brandTagline}</p>
              <div className="flex items-center gap-2 pt-2 text-muted-foreground font-mono text-[11px]">
                {config.socialLinks.twitter && <span>X</span>}
                {config.socialLinks.linkedin && <span>• LinkedIn</span>}
                {config.socialLinks.github && <span>• GitHub</span>}
                {config.socialLinks.rss && <span>• RSS</span>}
              </div>
            </div>

            { /* Dynamic Columns */ }
            {config.columns.map((col, idx)=><div key={idx} className="space-y-2.5">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-1.5 text-muted-foreground text-xs">
                  {col.links.map((link, lIdx)=><li key={lIdx} className="hover:underline cursor-pointer">
                      {link.label}
                    </li>)}
                </ul>
              </div>)}
          </div>

          { /* Bottom Copyright & Back to Top */ }
          <div className="px-8 py-4 bg-muted/40 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
            <div>{config.copyrightText}</div>
            {config.showBackToTop && <span className="flex items-center gap-1 text-foreground cursor-pointer hover:underline">
                <ArrowUpIcon className="size-3"/> Back to Top
              </span>}
          </div>
        </CardContent>
      </Card>

      { /* Editor Controls */ }
      <div className="grid gap-6 lg:grid-cols-2">
        { /* Brand & Newsletter Configuration */ }
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Branding & Dispatch Bar</CardTitle>
            <CardDescription className="text-xs">
              Footer brand summary, newsletter header, and bottom utility switches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Footer Brand Name</Label>
              <Input value={config.brandName} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                brandName: e.target.value
            }))} className="font-serif text-sm font-bold"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Brand Mission / Tagline</Label>
              <Textarea rows={2} value={config.brandTagline} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                brandTagline: e.target.value
            }))} className="text-xs resize-none"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Copyright Attribution Text</Label>
              <Input value={config.copyrightText} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                copyrightText: e.target.value
            }))} className="font-mono text-xs"/>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Newsletter Subscribe Bar</div>
                <div className="text-[11px] text-muted-foreground">Show subscription callout above footer links.</div>
              </div>
              <Switch checked={config.showNewsletterSignup} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                showNewsletterSignup: v
            }))}/>
            </div>

            {config.showNewsletterSignup && <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Newsletter Title</Label>
                  <Input value={config.newsletterHeading} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                newsletterHeading: e.target.value
            }))} className="text-xs"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Newsletter Subtext</Label>
                  <Input value={config.newsletterDescription} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                newsletterDescription: e.target.value
            }))} className="text-xs"/>
                </div>
              </>}

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Back to Top Trigger</div>
                <div className="text-[11px] text-muted-foreground">Smooth scroll back to top of broadsheet.</div>
              </div>
              <Switch checked={config.showBackToTop} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                showBackToTop: v
            }))}/>
            </div>
          </CardContent>
        </Card>

        { /* Social Links & Syndication */ }
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Social & Syndication Feeds</CardTitle>
            <CardDescription className="text-xs">
              Connect official publication handles and RSS dispatch endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">X (formerly Twitter)</Label>
              <Input value={config.socialLinks.twitter || ''} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    twitter: e.target.value
                }
            }))} placeholder="https://x.com/thechronicle" className="text-xs font-mono"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">LinkedIn Organization</Label>
              <Input value={config.socialLinks.linkedin || ''} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    linkedin: e.target.value
                }
            }))} placeholder="https://linkedin.com/company/thechronicle" className="text-xs font-mono"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">GitHub Organization / Source Code</Label>
              <Input value={config.socialLinks.github || ''} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    github: e.target.value
                }
            }))} placeholder="https://github.com/thechronicle" className="text-xs font-mono"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">YouTube Channel</Label>
              <Input value={config.socialLinks.youtube || ''} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    youtube: e.target.value
                }
            }))} placeholder="https://youtube.com/@thechronicle" className="text-xs font-mono"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">RSS Syndication Feed URL</Label>
              <Input value={config.socialLinks.rss || ''} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    rss: e.target.value
                }
            }))} placeholder="/feed.xml" className="text-xs font-mono"/>
            </div>
          </CardContent>
        </Card>
      </div>

      { /* Columns & Link Sections */ }
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Footer Columns & Navigation Trees</h3>
            <p className="text-xs text-muted-foreground">Manage thematic section links and legal policies.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addColumn} className="text-xs gap-1.5">
            <PlusIcon className="size-3.5"/> Add Footer Column
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {config.columns.map((column, colIdx)=><Card key={colIdx} className="border">
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <Input value={column.title} onChange={(e)=>updateColumnTitle(colIdx, e.target.value)} placeholder="Column Title" className="font-semibold text-xs h-8 max-w-[200px]"/>
                <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive hover:bg-destructive/10" onClick={()=>removeColumn(colIdx)}>
                  <Trash2Icon className="size-3.5"/>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-2">
                  {column.links.map((link, lIdx)=><div key={lIdx} className="flex items-center gap-1.5">
                      <Input value={link.label} onChange={(e)=>updateLink(colIdx, lIdx, 'label', e.target.value)} placeholder="Label" className="text-xs h-7 flex-1"/>
                      <Input value={link.url} onChange={(e)=>updateLink(colIdx, lIdx, 'url', e.target.value)} placeholder="/url" className="text-xs font-mono h-7 flex-1"/>
                      <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0 text-destructive hover:bg-destructive/10" onClick={()=>removeLink(colIdx, lIdx)}>
                        <Trash2Icon className="size-3"/>
                      </Button>
                    </div>)}
                </div>

                <Button type="button" variant="outline" size="sm" onClick={()=>addLinkToColumn(colIdx)} className="w-full text-xs h-7 gap-1 mt-2">
                  <PlusIcon className="size-3"/> Add Link
                </Button>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
}
