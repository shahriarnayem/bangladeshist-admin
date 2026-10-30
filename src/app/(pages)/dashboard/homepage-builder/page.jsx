'use client';
import { useState, useEffect } from 'react';
import { Eye, Save, Radio, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
const DEFAULT_SECTIONS = [
    {
        id: 'sec-hero',
        name: 'Lead Hero Story & Spotlight (1+4 Grid)',
        description: 'Main editorial anchor story with 4 complementary top dispatches.',
        enabled: true,
        articleCount: 5,
        icon: 'Layers'
    },
    {
        id: 'sec-trending',
        name: 'Trending & High Velocity Readership',
        description: 'Algorithmic ranking of most-read stories within the last 24 hours.',
        enabled: true,
        articleCount: 6,
        icon: 'TrendingUp'
    },
    {
        id: 'sec-photocard',
        name: 'Photocard Visual Journalism Strip',
        description: 'Horizontal scrollable photocard highlights with quote callouts.',
        enabled: true,
        articleCount: 8,
        icon: 'Sparkles'
    },
    {
        id: 'sec-video',
        name: 'Video Studio News Reels',
        description: 'Vertical 9:16 and 16:9 shortform video dispatches and field reports.',
        enabled: true,
        articleCount: 4,
        icon: 'Video'
    },
    {
        id: 'sec-opinion',
        name: 'Opinion & Editorial Columns',
        description: 'Opinion columns, guest commentary, and editorial board stances.',
        enabled: true,
        articleCount: 4,
        icon: 'MessageSquare'
    },
    {
        id: 'sec-economy',
        name: 'Economy, Banking & Trade Beat',
        description: 'In-depth coverage of RMG, remittances, monetary policy, and markets.',
        enabled: true,
        articleCount: 4,
        icon: 'FileText'
    },
    {
        id: 'sec-geopolitics',
        name: 'Bay of Bengal & Regional Diplomacy',
        description: 'Foreign relations, regional security, and international affairs.',
        enabled: true,
        articleCount: 4,
        icon: 'FileText'
    },
    {
        id: 'sec-culture',
        name: 'Culture, Heritage & Geneva Life',
        description: 'Art, literature, urban heritage, and living traditions.',
        enabled: true,
        articleCount: 4,
        icon: 'FileText'
    }
];
export default function HomepageBuilderPage() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);
    const [heroLayout, setHeroLayout] = useState('1+4');
    const [breakingEnabled, setBreakingEnabled] = useState(true);
    const [breakingText, setBreakingText] = useState('BREAKING: Law Commission submits initial framework for electoral governance overhaul');
    const [breakingUrl, setBreakingUrl] = useState('/constitutional-reform-roadmap');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fetchConfig = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/homepage');
            const data = await res.json();
            if (data.success && data.config) {
                const c = data.config;
                if (c.sections && Array.isArray(c.sections) && c.sections.length > 0) {
                    setSections(c.sections);
                }
                if (c.heroLayout) setHeroLayout(c.heroLayout);
                if (c.breakingEnabled !== undefined) setBreakingEnabled(c.breakingEnabled);
                if (c.breakingText) setBreakingText(c.breakingText);
                if (c.breakingUrl) setBreakingUrl(c.breakingUrl);
            }
        } catch  {
        // Keep defaults
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchConfig();
    }, []);
    const handleToggleSection = (id)=>{
        setSections((prev)=>prev.map((s)=>s.id === id ? {
                    ...s,
                    enabled: !s.enabled
                } : s));
        toast.success('Section status toggled');
    };
    const handleMoveUp = (index)=>{
        if (index === 0) return;
        const newSections = [
            ...sections
        ];
        const temp = newSections[index - 1];
        newSections[index - 1] = newSections[index];
        newSections[index] = temp;
        setSections(newSections);
    };
    const handleMoveDown = (index)=>{
        if (index === sections.length - 1) return;
        const newSections = [
            ...sections
        ];
        const temp = newSections[index + 1];
        newSections[index + 1] = newSections[index];
        newSections[index] = temp;
        setSections(newSections);
    };
    const handleSave = async ()=>{
        try {
            setIsSaving(true);
            const res = await fetch('/api/homepage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sections,
                    breakingText,
                    breakingEnabled,
                    heroLayout,
                    breakingUrl
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Homepage editorial layout published to live site database');
            } else {
                toast.error(data.error || 'Failed to publish homepage layout');
            }
        } catch  {
            toast.error('Network error publishing homepage configuration');
        } finally{
            setIsSaving(false);
        }
    };
    return <div className='space-y-6'>
      { /* Page Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Homepage Section Builder</h1>
          <p className='text-muted-foreground text-sm'>
            Arrange frontpage editorial layout, configure breaking tickers, and toggle visual media strips.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchConfig}>
            <RefreshCw className='size-3.5'/> Refresh
          </Button>
          <a href='https://thechronicle.press' target='_blank' rel='noreferrer' className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'gap-1.5 text-xs font-medium'
    })}>
            <Eye className='size-3.5'/> View Public Site
          </a>
          <Button size='sm' onClick={handleSave} disabled={isSaving} className='gap-1.5 text-xs font-medium'>
            {isSaving ? <Loader2 className='size-3.5 animate-spin'/> : <Save className='size-3.5'/>}
            Publish Layout
          </Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        { /* Left Column (2 Cols): Controls & Sections */ }
        <div className='space-y-6 lg:col-span-2'>
          { /* Breaking News Ticker Card */ }
          <Card className='border'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-7 items-center justify-center rounded border'>
                    <Radio className='size-4 text-foreground'/>
                  </div>
                  <div>
                    <CardTitle className='text-base font-semibold'>Breaking News Alert Ticker</CardTitle>
                    <CardDescription className='text-xs'>
                      Emergency banner rendered across the very top of the homepage.
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={breakingEnabled} onCheckedChange={setBreakingEnabled}/>
              </div>
            </CardHeader>
            {breakingEnabled && <CardContent className='space-y-3 pt-2'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Headline Text</Label>
                  <Input value={breakingText} onChange={(e)=>setBreakingText(e.target.value)} className='text-xs'/>
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Linked Target URL</Label>
                  <Input value={breakingUrl} onChange={(e)=>setBreakingUrl(e.target.value)} className='font-mono text-xs'/>
                </div>
              </CardContent>}
          </Card>

          { /* Lead Hero Architecture */ }
          <Card className='border'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>Hero Lead Grid Architecture</CardTitle>
              <CardDescription className='text-xs'>
                Choose the presentation template for top stories above the fold.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 sm:grid-cols-3'>
                <div onClick={()=>setHeroLayout('1+4')} className={`cursor-pointer rounded-lg border p-3 transition-colors ${heroLayout === '1+4' ? 'border-foreground bg-muted/40' : 'border-border'}`}>
                  <div className='mb-1 text-xs font-semibold'>Standard 1+4 Grid</div>
                  <p className='text-muted-foreground text-[11px]'>
                    1 dominant headline on left with 4 stacked stories on right.
                  </p>
                </div>

                <div onClick={()=>setHeroLayout('dual')} className={`cursor-pointer rounded-lg border p-3 transition-colors ${heroLayout === 'dual' ? 'border-foreground bg-muted/40' : 'border-border'}`}>
                  <div className='mb-1 text-xs font-semibold'>Dual Split Focus</div>
                  <p className='text-muted-foreground text-[11px]'>
                    Two equally weighted lead dispatches for developing dual crises.
                  </p>
                </div>

                <div onClick={()=>setHeroLayout('magazine')} className={`cursor-pointer rounded-lg border p-3 transition-colors ${heroLayout === 'magazine' ? 'border-foreground bg-muted/40' : 'border-border'}`}>
                  <div className='mb-1 text-xs font-semibold'>Magazine Showcase</div>
                  <p className='text-muted-foreground text-[11px]'>
                    Full-width hero visual with embedded longform excerpt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          { /* Section Reordering List */ }
          <Card className='border'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>Section Hierarchy & Ordering</CardTitle>
              <CardDescription className='text-xs'>
                Toggle section activation and adjust display order on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {sections.map((section, idx)=><div key={section.id} className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${section.enabled ? 'bg-card' : 'bg-muted/20 opacity-60'}`}>
                  <div className='flex items-center gap-3'>
                    <span className='text-muted-foreground w-4 font-mono text-xs font-semibold'>
                      {idx + 1}
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-semibold text-foreground'>{section.name}</span>
                        <Badge variant='outline' className='font-mono text-[10px]'>
                          {section.articleCount} articles
                        </Badge>
                      </div>
                      <p className='text-muted-foreground line-clamp-1 text-[11px]'>
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground size-6 text-xs' disabled={idx === 0} onClick={()=>handleMoveUp(idx)}>
                        ▲
                      </Button>
                      <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground size-6 text-xs' disabled={idx === sections.length - 1} onClick={()=>handleMoveDown(idx)}>
                        ▼
                      </Button>
                    </div>
                    <Switch checked={section.enabled} onCheckedChange={()=>handleToggleSection(section.id)}/>
                  </div>
                </div>)}
            </CardContent>
          </Card>
        </div>

        { /* Right Column: Live Wireframe Schematic Preview */ }
        <div>
          <Card className='sticky top-6 border'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-semibold'>Frontpage Wireframe Schematic</CardTitle>
              <CardDescription className='text-xs'>
                Live structural representation of `thechronicle.press`.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='rounded border bg-muted/40 p-2 text-center font-mono text-[11px] font-semibold'>
                THE CHRONICLE HEADER & NAV
              </div>

              {breakingEnabled && <div className='rounded border border-dashed p-1.5 text-center font-mono text-[10px]'>
                  [BREAKING TICKER ACTIVE]
                </div>}

              <div className='space-y-1.5'>
                {sections.filter((s)=>s.enabled).map((s, idx)=><div key={s.id} className='rounded border p-2 text-center text-[11px] font-medium transition-colors hover:bg-muted/40'>
                      <div className='text-muted-foreground font-mono text-[10px]'>Section {idx + 1}</div>
                      <div>{s.name.split(' (')[0]}</div>
                    </div>)}
              </div>

              <div className='rounded border bg-muted/40 p-2 text-center font-mono text-[11px] font-semibold'>
                FOOTER & ARCHIVE
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
