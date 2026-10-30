'use client';
import { useState, useEffect } from 'react';
import { SaveIcon, RefreshCwIcon, Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImagePicker } from '@/components/shared/ImagePicker';
export default function AppearancePage() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Brand Identity
    const [siteName, setSiteName] = useState('THE CHRONICLE');
    const [tagline, setTagline] = useState('Veritas • Libertas • Iustitia — Established 1894');
    const [logoUrl, setLogoUrl] = useState('');
    const [darkLogoUrl, setDarkLogoUrl] = useState('');
    const [faviconUrl, setFaviconUrl] = useState('');
    // Colors Control (Pure Monochrome OKLCH)
    const [monochromeLock, setMonochromeLock] = useState(true);
    const [colorMode, setColorMode] = useState('system');
    const [surfaceContrast, setSurfaceContrast] = useState('standard') // standard, high, oled
    ;
    const [borderRadius, setBorderRadius] = useState('4px') // 0px, 4px, 8px
    ;
    const [canvasTint, setCanvasTint] = useState('paper') // pure, paper, slate
    ;
    // Typography Engine
    const [headlineFont, setHeadlineFont] = useState('Playfair Display');
    const [bodyFont, setBodyFont] = useState('Geist');
    const [baseFontSize, setBaseFontSize] = useState('16px');
    const [lineHeight, setLineHeight] = useState('1.65');
    const [letterSpacing, setLetterSpacing] = useState('normal');
    // Masthead & Layout Options
    const [compactMasthead, setCompactMasthead] = useState(false);
    const [showDateRibbon, setShowDateRibbon] = useState(true);
    const [showEditionSelector, setShowEditionSelector] = useState(true);
    const fetchAppearance = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/appearance');
            const data = await res.json();
            if (data.success && data.appearance) {
                const a = data.appearance;
                if (a.siteName) setSiteName(a.siteName);
                if (a.tagline) setTagline(a.tagline);
                if (a.logoUrl) setLogoUrl(a.logoUrl);
                if (a.darkLogoUrl) setDarkLogoUrl(a.darkLogoUrl);
                if (a.faviconUrl) setFaviconUrl(a.faviconUrl);
                // Colors
                if (a.monochromeLock !== undefined) setMonochromeLock(a.monochromeLock);
                if (a.colorMode) setColorMode(a.colorMode);
                if (a.surfaceContrast) setSurfaceContrast(a.surfaceContrast);
                if (a.borderRadius) setBorderRadius(a.borderRadius);
                if (a.canvasTint) setCanvasTint(a.canvasTint);
                // Typography
                if (a.headlineFont) setHeadlineFont(a.headlineFont);
                if (a.bodyFont) setBodyFont(a.bodyFont);
                if (a.baseFontSize) setBaseFontSize(a.baseFontSize);
                if (a.lineHeight) setLineHeight(a.lineHeight);
                if (a.letterSpacing) setLetterSpacing(a.letterSpacing);
                // Layout
                if (a.compactMasthead !== undefined) setCompactMasthead(a.compactMasthead);
                if (a.showDateRibbon !== undefined) setShowDateRibbon(a.showDateRibbon);
                if (a.showEditionSelector !== undefined) setShowEditionSelector(a.showEditionSelector);
            }
        } catch  {
        // Keep defaults
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchAppearance();
    }, []);
    const handleSaveAppearance = async (e)=>{
        if (e) e.preventDefault();
        try {
            setIsSaving(true);
            const res = await fetch('/api/appearance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    siteName,
                    tagline,
                    logoUrl,
                    darkLogoUrl,
                    faviconUrl,
                    monochromeLock,
                    colorMode,
                    surfaceContrast,
                    borderRadius,
                    canvasTint,
                    headlineFont,
                    bodyFont,
                    baseFontSize,
                    lineHeight,
                    letterSpacing,
                    compactMasthead,
                    showDateRibbon,
                    showEditionSelector
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Site branding, colors, and typography saved to MongoDB');
            } else {
                toast.error(data.error || 'Failed to save appearance settings');
            }
        } catch  {
            toast.error('Network error saving appearance');
        } finally{
            setIsSaving(false);
        }
    };
    return <div className="space-y-6 pb-12">
      { /* Header */ }
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Theme & Appearance Customizer</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              OKLCH Monochrome
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Control publication identity, Cloudinary brand assets, zero-chroma monochrome palette, and typography.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={fetchAppearance}>
            <RefreshCwIcon className="size-3.5"/> Refresh
          </Button>
          <Button size="sm" onClick={()=>handleSaveAppearance()} disabled={isSaving} className="gap-1.5 text-xs font-medium">
            {isSaving ? <Loader2Icon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            Publish Appearance
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        { /* Left Column (2 cols): Controls Tabs */ }
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="brand" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="brand">Brand & Logos</TabsTrigger>
              <TabsTrigger value="colors">Colors Control</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="layout">Layout Options</TabsTrigger>
            </TabsList>

            { /* Tab 1: Brand & Logos */ }
            <TabsContent value="brand" className="space-y-6">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Publication Identity</CardTitle>
                  <CardDescription className="text-xs">
                    Editorial brand title and founding Latin motto.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Publication Name</Label>
                      <Input value={siteName} onChange={(e)=>setSiteName(e.target.value)} className="text-xs font-semibold"/>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Editorial Motto / Tagline</Label>
                      <Input value={tagline} onChange={(e)=>setTagline(e.target.value)} className="text-xs"/>
                    </div>
                  </div>
                </CardContent>
              </Card>

              { /* Brand Asset Image Pickers */ }
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Brand Assets (Upload or Select from Library)</CardTitle>
                  <CardDescription className="text-xs">
                    Upload vector SVG or PNG brand marks directly or choose from your media assets.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  { /* Light Mode Logo */ }
                  <div className="border-b pb-5">
                    <ImagePicker value={logoUrl} onChange={setLogoUrl} label="Light Mode Masthead Logo" aspectRatio="banner" description="Vector SVG or PNG with transparent background. Upload from device or choose from Media Library."/>
                  </div>

                  { /* Dark Mode Logo */ }
                  <div className="border-b pb-5">
                    <ImagePicker value={darkLogoUrl} onChange={setDarkLogoUrl} label="Dark Mode Masthead Logo" aspectRatio="banner" description="Inverted white/light vector SVG or PNG. Upload from device or choose from Media Library."/>
                  </div>

                  { /* Favicon */ }
                  <div>
                    <ImagePicker value={faviconUrl} onChange={setFaviconUrl} label="Publication Favicon & App Icon" aspectRatio="square" description="1:1 square icon (.ico, .png, .svg). Upload from device or choose from Media Library."/>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            { /* Tab 2: Colors Control */ }
            <TabsContent value="colors" className="space-y-6">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Monochrome OKLCH Engine</CardTitle>
                  <CardDescription className="text-xs">
                    Precise achromatic contrast controls with mathematically guaranteed 0% chroma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold">Strict Monochrome OKLCH Lock</div>
                      <div className="text-muted-foreground text-[11px]">
                        Enforces Chroma = 0 across all UI elements, borders, badges, and charts.
                      </div>
                    </div>
                    <Switch checked={monochromeLock} onCheckedChange={setMonochromeLock}/>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Default Public Color Theme</Label>
                      <Select value={colorMode} onValueChange={(val)=>{
        if (val) setColorMode(val);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System Preference (Auto)</SelectItem>
                          <SelectItem value="light">Broadsheet Light (Paper White)</SelectItem>
                          <SelectItem value="dark">Obsidian Dark (Pitch Black)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Surface Contrast Profile</Label>
                      <Select value={surfaceContrast} onValueChange={(val)=>{
        if (val) setSurfaceContrast(val);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Newsprint (Balanced Gray)</SelectItem>
                          <SelectItem value="high">High Contrast (Crisp Monochrome)</SelectItem>
                          <SelectItem value="oled">Pure OLED 100% Black & White</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Border Radius & Edge Geometry</Label>
                      <Select value={borderRadius} onValueChange={(val)=>{
        if (val) setBorderRadius(val);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0px">Square 0px (Traditional Newspaper Broadsheet)</SelectItem>
                          <SelectItem value="4px">Subtle 4px (Modern Technical)</SelectItem>
                          <SelectItem value="8px">Soft 8px (Contemporary Magazine)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Canvas Background Tint</Label>
                      <Select value={canvasTint} onValueChange={(val)=>{
        if (val) setCanvasTint(val);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pure">Pure 100% White / Black</SelectItem>
                          <SelectItem value="paper">Broadsheet Newsprint Paper (Oklch 98.5% 0 0)</SelectItem>
                          <SelectItem value="slate">Cool Achromatic Slate (Oklch 97.5% 0 0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            { /* Tab 3: Typography */ }
            <TabsContent value="typography" className="space-y-6">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Newsroom Typography Stack</CardTitle>
                  <CardDescription className="text-xs">
                    Select editorial serif headline and modern sans-serif body typefaces.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Editorial Headline Serif Font</Label>
                      <Select value={headlineFont} onValueChange={(v)=>{
        if (v) setHeadlineFont(v);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Playfair Display">Playfair Display (Classic Broadsheet)</SelectItem>
                          <SelectItem value="Merriweather">Merriweather (Literary Editorial)</SelectItem>
                          <SelectItem value="Georgia">Georgia (Timeless Journalistic)</SelectItem>
                          <SelectItem value="Garamond">EB Garamond (Traditional Heritage)</SelectItem>
                          <SelectItem value="Geist">Geist Mono (Technical Broadsheet)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Body Copy Reading Font</Label>
                      <Select value={bodyFont} onValueChange={(v)=>{
        if (v) setBodyFont(v);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Geist">Geist Sans (Vercel Clean High-Contrast)</SelectItem>
                          <SelectItem value="Inter">Inter (Ultra-Clean Screen Typography)</SelectItem>
                          <SelectItem value="Newsreader">Newsreader (Longform Serif Body)</SelectItem>
                          <SelectItem value="Roboto">Roboto (Compact Multi-Column)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Base Font Size</Label>
                      <Select value={baseFontSize} onValueChange={(v)=>{
        if (v) setBaseFontSize(v);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15px">15px (Compact Multi-Column)</SelectItem>
                          <SelectItem value="16px">16px (Standard Broadsheet)</SelectItem>
                          <SelectItem value="17px">17px (High Legibility)</SelectItem>
                          <SelectItem value="18px">18px (Longform Reading)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Body Line Height</Label>
                      <Select value={lineHeight} onValueChange={(v)=>{
        if (v) setLineHeight(v);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.5">1.5 (Compact)</SelectItem>
                          <SelectItem value="1.65">1.65 (Editorial Standard)</SelectItem>
                          <SelectItem value="1.8">1.8 (Spacious)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tracking / Kerning</Label>
                      <Select value={letterSpacing} onValueChange={(v)=>{
        if (v) setLetterSpacing(v);
    }}>
                        <SelectTrigger className="text-xs">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tight">Tight (-0.02em)</SelectItem>
                          <SelectItem value="normal">Normal (0)</SelectItem>
                          <SelectItem value="wide">Wide (+0.03em)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            { /* Tab 4: Layout Options */ }
            <TabsContent value="layout" className="space-y-6">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Layout & Spacing Geometry</CardTitle>
                  <CardDescription className="text-xs">
                    Fine-tune broadsheet margins, ribbon visibility, and sticky behaviors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold">Compact Masthead Mode</div>
                      <div className="text-muted-foreground text-[11px]">
                        Reduces vertical header padding for maximum above-the-fold story density.
                      </div>
                    </div>
                    <Switch checked={compactMasthead} onCheckedChange={setCompactMasthead}/>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold">Top Date Ribbon</div>
                      <div className="text-muted-foreground text-[11px]">
                        Display publication date and edition stamp above main broadsheet title.
                      </div>
                    </div>
                    <Switch checked={showDateRibbon} onCheckedChange={setShowDateRibbon}/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold">Global Edition Selector</div>
                      <div className="text-muted-foreground text-[11px]">
                        Allow readers to switch between International, Americas, and European editions.
                      </div>
                    </div>
                    <Switch checked={showEditionSelector} onCheckedChange={setShowEditionSelector}/>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        { /* Right Column (1 col): Live Brand Masthead & Typography Preview */ }
        <div>
          <Card className="sticky top-6 border shadow-xs overflow-hidden">
            <CardHeader className="pb-3 bg-muted/40 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Live Broadsheet Preview</CardTitle>
                <CardDescription className="text-[11px]">
                  Real-time rendering of chosen typography & contrast.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {borderRadius} RADIUS
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="bg-card text-foreground border p-4 space-y-3" style={{
        borderRadius,
        backgroundColor: canvasTint === 'paper' ? 'var(--card)' : undefined
    }}>
                { /* Top date strip */ }
                {showDateRibbon && <div className="text-muted-foreground flex items-center justify-between border-b pb-2 text-[10px] font-mono">
                    <span>Friday, October 30, 2026</span>
                    {showEditionSelector && <span>GLOBAL EDITION</span>}
                  </div>}

                { /* Brand Name */ }
                <div className="py-2 text-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight uppercase" style={{
        fontFamily: headlineFont
    }}>
                    {siteName}
                  </div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-widest font-mono">
                    {tagline}
                  </div>
                </div>

                { /* Nav bar */ }
                <div className="flex items-center justify-center gap-2 border-t border-b py-1.5 text-[10px] font-semibold tracking-wider uppercase text-foreground/80">
                  <span>WORLD</span>
                  <span>·</span>
                  <span>MARKETS</span>
                  <span>·</span>
                  <span>TECH</span>
                  <span>·</span>
                  <span>POLICY</span>
                </div>

                { /* Editorial Sample */ }
                <div className="pt-2 space-y-1.5 text-left">
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-foreground text-background">
                    LEAD STORY
                  </span>
                  <h4 className="font-bold text-base leading-snug" style={{
        fontFamily: headlineFont
    }}>
                    Global Accord Reached on Algorithmic Sovereign Debt Restructuring
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed" style={{
        fontFamily: bodyFont,
        fontSize: baseFontSize,
        lineHeight
    }}>
                    Delegates from forty-two financial authorities concluded marathon negotiations
                    early Friday, finalizing a framework intended to stabilize cross-border debt
                    obligations against algorithmic flash shocks.
                  </p>
                </div>
              </div>

              { /* Status summary pills */ }
              <div className="space-y-1.5 rounded border bg-muted/20 p-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serif Headline:</span>
                  <span className="font-semibold">{headlineFont}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Body Font:</span>
                  <span className="font-semibold">{bodyFont}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Size:</span>
                  <span>{baseFontSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chroma:</span>
                  <span className="text-foreground font-bold">0% (Pure OKLCH)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Surface:</span>
                  <span className="capitalize">{surfaceContrast}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
