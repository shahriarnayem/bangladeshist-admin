'use client';
import { useState, useEffect } from 'react';
import { SaveIcon, RefreshCwIcon, PlusIcon, Trash2Icon, MoveUpIcon, MoveDownIcon, EyeIcon, CalendarIcon, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function HeaderBuilderPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        topBarEnabled: true,
        topBarText: 'The Chronicle • Published in New York, London & Tokyo',
        showDateRibbon: true,
        dateFormat: 'gregorian',
        showEditionSelector: true,
        editionName: 'Global International Edition',
        mastheadStyle: 'classic',
        mastheadTitle: 'THE CHRONICLE',
        mastheadMotto: 'Veritas • Libertas • Iustitia — Established 1894',
        logoUrl: '',
        logoAlignment: 'center',
        navSticky: true,
        navAlignment: 'center',
        showSearchButton: true,
        showThemeToggle: true,
        showBreakingTicker: true,
        breakingTickerLabel: 'BREAKING',
        headerNavItems: [
            {
                label: 'World',
                url: '/category/world'
            },
            {
                label: 'Business & Markets',
                url: '/category/business'
            },
            {
                label: 'Technology',
                url: '/category/tech'
            },
            {
                label: 'Policy & Governance',
                url: '/category/policy'
            },
            {
                label: 'Opinion & Editorial',
                url: '/category/opinion'
            },
            {
                label: 'Culture & Arts',
                url: '/category/culture'
            },
            {
                label: 'Science',
                url: '/category/science'
            }
        ]
    });
    // New nav item inputs
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');
    useEffect(()=>{
        async function loadConfig() {
            setLoading(true);
            try {
                const res = await fetch('/api/header');
                const data = await res.json();
                if (data.success && data.config) {
                    setConfig(data.config);
                }
            } catch  {
                toast.error('Failed to load header configuration');
            } finally{
                setLoading(false);
            }
        }
        loadConfig();
    }, []);
    const handleSave = async ()=>{
        setSaving(true);
        try {
            const res = await fetch('/api/header', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Header layout saved to MongoDB');
            } else {
                toast.error(data.error || 'Failed to save header settings');
            }
        } catch  {
            toast.error('Network error saving header settings');
        } finally{
            setSaving(false);
        }
    };
    const addNavItem = ()=>{
        if (!newLabel.trim() || !newUrl.trim()) {
            toast.error('Please enter both label and path');
            return;
        }
        setConfig((prev)=>({
                ...prev,
                headerNavItems: [
                    ...prev.headerNavItems,
                    {
                        label: newLabel.trim(),
                        url: newUrl.trim()
                    }
                ]
            }));
        setNewLabel('');
        setNewUrl('');
        toast.success('Navigation link added');
    };
    const removeNavItem = (index)=>{
        setConfig((prev)=>({
                ...prev,
                headerNavItems: prev.headerNavItems.filter((_, i)=>i !== index)
            }));
    };
    const moveNavItem = (index, direction)=>{
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= config.headerNavItems.length) return;
        const updated = [
            ...config.headerNavItems
        ];
        const temp = updated[index];
        updated[index] = updated[targetIdx];
        updated[targetIdx] = temp;
        setConfig((prev)=>({
                ...prev,
                headerNavItems: updated
            }));
    };
    if (loading) {
        return <div className="py-24 text-center space-y-3">
        <RefreshCwIcon className="mx-auto size-6 animate-spin text-muted-foreground"/>
        <p className="text-xs text-muted-foreground">Loading Header Builder from MongoDB...</p>
      </div>;
    }
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Header & Masthead Builder</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              Global Front
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure editorial broadsheet masthead, date ribbon, navigation beats, and breaking tickers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 text-xs font-medium">
            {saving ? <RefreshCwIcon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            {saving ? 'Saving...' : 'Save Header Layout'}
          </Button>
        </div>
      </div>

      { /* Live Preview Box */ }
      <Card className="border bg-background shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon className="size-4 text-muted-foreground"/>
            <span className="text-xs font-semibold uppercase tracking-wider">Live Masthead Preview</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Desktop Broadsheet Mode
          </Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          { /* Preview Top Bar */ }
          {config.topBarEnabled && <div className="px-6 py-1.5 bg-muted/50 text-[11px] font-mono flex items-center justify-between border-b">
              <div>{config.topBarText}</div>
              <div className="flex items-center gap-4 text-muted-foreground">
                {config.showDateRibbon && <span className="flex items-center gap-1">
                    <CalendarIcon className="size-3"/>
                    {config.dateFormat === 'hijri' ? '18 Jumada al-awwal 1448' : 'Friday, October 30, 2026'}
                  </span>}
                {config.showEditionSelector && <span className="font-medium text-foreground">{config.editionName}</span>}
              </div>
            </div>}

          { /* Preview Breaking Ticker */ }
          {config.showBreakingTicker && <div className="px-6 py-2 bg-foreground text-background text-xs font-medium flex items-center gap-3">
              <span className="font-mono font-bold text-[10px] uppercase bg-background text-foreground px-1.5 py-0.5 rounded-xs">
                {config.breakingTickerLabel}
              </span>
              <span className="truncate">
                Central Banks coordinate currency swap lines amid unexpected volatility • Energy ministers convene for emergency summit in Geneva
              </span>
            </div>}

          { /* Preview Masthead */ }
          <div className="py-8 px-6 text-center space-y-2 bg-background">
            <h2 className="font-serif text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              {config.mastheadTitle || 'THE CHRONICLE'}
            </h2>
            {config.mastheadMotto && <p className="font-serif italic text-xs text-muted-foreground tracking-widest uppercase">
                {config.mastheadMotto}
              </p>}
          </div>

          { /* Preview Navigation */ }
          <div className={`px-6 py-2.5 bg-muted/20 flex flex-wrap items-center gap-6 text-xs font-medium uppercase tracking-wider ${config.navAlignment === 'center' ? 'justify-center' : config.navAlignment === 'spread' ? 'justify-between' : 'justify-start'}`}>
            {config.headerNavItems.map((item, idx)=><span key={idx} className="hover:underline cursor-pointer">
                {item.label}
              </span>)}
            {config.showSearchButton && <span className="flex items-center gap-1 text-muted-foreground ml-auto cursor-pointer">
                <SearchIcon className="size-3.5"/> Search
              </span>}
          </div>
        </CardContent>
      </Card>

      { /* Configuration Controls */ }
      <div className="grid gap-6 lg:grid-cols-2">
        { /* Masthead & Branding */ }
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Broadsheet Masthead</CardTitle>
            <CardDescription className="text-xs">
              Brand title typography, Latin motto, and style template.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Publication Masthead Name</Label>
              <Input value={config.mastheadTitle} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                mastheadTitle: e.target.value
            }))} placeholder="THE CHRONICLE" className="font-serif text-sm font-bold"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Editorial Motto / Byline</Label>
              <Input value={config.mastheadMotto} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                mastheadMotto: e.target.value
            }))} placeholder="Veritas • Libertas • Iustitia — Established 1894" className="text-xs"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Masthead Layout</Label>
                <Select value={config.mastheadStyle} onValueChange={(val)=>{
        if (val) setConfig((prev)=>({
                ...prev,
                mastheadStyle: val
            }));
    }}>
                  <SelectTrigger className="text-xs">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic Broadsheet</SelectItem>
                    <SelectItem value="centered">Centered Modern</SelectItem>
                    <SelectItem value="minimal">Minimal Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Navbar Alignment</Label>
                <Select value={config.navAlignment} onValueChange={(val)=>{
        if (val) setConfig((prev)=>({
                ...prev,
                navAlignment: val
            }));
    }}>
                  <SelectTrigger className="text-xs">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Centered</SelectItem>
                    <SelectItem value="left">Left-aligned</SelectItem>
                    <SelectItem value="spread">Justified / Spread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Sticky Navigation Bar</div>
                <div className="text-[11px] text-muted-foreground">Pin navigation to top of screen during scroll.</div>
              </div>
              <Switch checked={config.navSticky} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                navSticky: v
            }))}/>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Search Icon Button</div>
                <div className="text-[11px] text-muted-foreground">Display quick search modal trigger in navbar.</div>
              </div>
              <Switch checked={config.showSearchButton} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                showSearchButton: v
            }))}/>
            </div>
          </CardContent>
        </Card>

        { /* Top Ribbon & Alert Ticker */ }
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Ribbon & Breaking Ticker</CardTitle>
            <CardDescription className="text-xs">
              Manage international dispatch strip, date formatting, and emergency ticker.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Top Ribbon Bar</div>
                <div className="text-[11px] text-muted-foreground">Show thin utility bar at top of page.</div>
              </div>
              <Switch checked={config.topBarEnabled} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                topBarEnabled: v
            }))}/>
            </div>

            {config.topBarEnabled && <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Top Ribbon Headline Text</Label>
                <Input value={config.topBarText} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                topBarText: e.target.value
            }))} className="text-xs font-mono"/>
              </div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date Format</Label>
                <Select value={config.dateFormat} onValueChange={(val)=>{
        if (val) setConfig((prev)=>({
                ...prev,
                dateFormat: val
            }));
    }}>
                  <SelectTrigger className="text-xs">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian">Gregorian (Standard)</SelectItem>
                    <SelectItem value="hijri">Hijri (Islamic)</SelectItem>
                    <SelectItem value="solar">Solar Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Edition Label</Label>
                <Input value={config.editionName} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                editionName: e.target.value
            }))} className="text-xs"/>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold">Breaking News Alert Ticker</div>
                <div className="text-[11px] text-muted-foreground">High-priority alert banner beneath top bar.</div>
              </div>
              <Switch checked={config.showBreakingTicker} onCheckedChange={(v)=>setConfig((prev)=>({
                ...prev,
                showBreakingTicker: v
            }))}/>
            </div>

            {config.showBreakingTicker && <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Ticker Badge Label</Label>
                <Input value={config.breakingTickerLabel} onChange={(e)=>setConfig((prev)=>({
                ...prev,
                breakingTickerLabel: e.target.value
            }))} className="text-xs font-mono uppercase" placeholder="BREAKING"/>
              </div>}
          </CardContent>
        </Card>
      </div>

      { /* Header Navigation Items Manager */ }
      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Editorial Navigation Items</CardTitle>
          <CardDescription className="text-xs">
            Add, reorder, or remove beats and sections appearing in the primary header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {config.headerNavItems.map((item, idx)=><div key={idx} className="flex items-center justify-between p-2.5 bg-muted/30 border rounded-md text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-muted-foreground w-5 text-center">{idx + 1}</span>
                  <span className="font-semibold text-foreground">{item.label}</span>
                  <span className="font-mono text-muted-foreground text-[11px]">{item.url}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="size-7" disabled={idx === 0} onClick={()=>moveNavItem(idx, 'up')}>
                    <MoveUpIcon className="size-3.5"/>
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-7" disabled={idx === config.headerNavItems.length - 1} onClick={()=>moveNavItem(idx, 'down')}>
                    <MoveDownIcon className="size-3.5"/>
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive hover:bg-destructive/10" onClick={()=>removeNavItem(idx)}>
                    <Trash2Icon className="size-3.5"/>
                  </Button>
                </div>
              </div>)}
          </div>

          { /* Add Nav Item */ }
          <div className="pt-2 border-t grid gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <Input placeholder="Link Label (e.g. Investigations)" value={newLabel} onChange={(e)=>setNewLabel(e.target.value)} className="text-xs"/>
            </div>
            <div className="sm:col-span-2">
              <Input placeholder="Path (e.g. /category/investigations)" value={newUrl} onChange={(e)=>setNewUrl(e.target.value)} className="text-xs font-mono"/>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addNavItem} className="text-xs gap-1.5">
              <PlusIcon className="size-3.5"/> Add Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
}
