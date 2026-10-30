'use client';
import { useState, useEffect } from 'react';
import { SaveIcon, Loader2Icon, RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImagePicker } from '@/components/shared/ImagePicker';
export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Tab 1: General & Branding
    const [siteName, setSiteName] = useState('THE CHRONICLE');
    const [tagline, setTagline] = useState('Veritas • Libertas • Iustitia — Established 1894');
    const [description, setDescription] = useState('The Chronicle is an independent international publication delivering investigative reporting, macroeconomic intelligence, and cultural analysis across global hubs.');
    const [logoUrl, setLogoUrl] = useState('');
    const [darkLogoUrl, setDarkLogoUrl] = useState('');
    const [faviconUrl, setFaviconUrl] = useState('');
    // Tab 2: Editorial & Wire Parameters
    const [postsPerPage, setPostsPerPage] = useState('12');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [enableLoadingSkeletons, setEnableLoadingSkeletons] = useState(true);
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [commentModeration, setCommentModeration] = useState('auto') // 'auto' | 'review'
    ;
    const [allowUserArticleSubmission, setAllowUserArticleSubmission] = useState(false);
    const [breakingTickerSpeed, setBreakingTickerSpeed] = useState('medium') // 'slow' | 'medium' | 'fast'
    ;
    // Tab 3: Institutional Headquarters & Contact
    const [footerAbout, setFooterAbout] = useState('The Chronicle is dedicated to fearless investigative reporting, intellectual rigor, and cultural preservation across international jurisdictions.');
    const [footerAddress, setFooterAddress] = useState('10 Fleet Street, London EC4A 2AB, United Kingdom');
    const [footerPhone, setFooterPhone] = useState('+44 20 7946 0192');
    const [footerEmail, setFooterEmail] = useState('desk@thechronicle.press');
    const [editorialInquiriesEmail, setEditorialInquiriesEmail] = useState('editor@thechronicle.press');
    // Tab 4: Social Channels & Syndication
    const [socialTwitter, setSocialTwitter] = useState('https://x.com/thechronicle');
    const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/thechronicle');
    const [socialLinkedin, setSocialLinkedin] = useState('https://linkedin.com/company/thechronicle');
    const [socialYoutube, setSocialYoutube] = useState('https://youtube.com/@thechronicle');
    const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/thechronicle');
    const [rssFeedUrl, setRssFeedUrl] = useState('/feed.xml');
    // Tab 5: Performance & Security
    const [enforceHttps, setEnforceHttps] = useState(true);
    const [cacheMaxAge, setCacheMaxAge] = useState('3600');
    const [logRetentionDays, setLogRetentionDays] = useState('90');
    const fetchSettings = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.success && data.settings) {
                const s = data.settings;
                // Helper to extract flat or nested setting value
                const getVal = (key)=>{
                    if (s[key] !== undefined) return s[key];
                    if (s.settings && s.settings[key] !== undefined) return s.settings[key];
                    return undefined;
                };
                // Branding
                if (getVal('siteName')) setSiteName(getVal('siteName'));
                if (getVal('tagline')) setTagline(getVal('tagline'));
                if (getVal('description')) setDescription(getVal('description'));
                if (getVal('logoUrl')) setLogoUrl(getVal('logoUrl'));
                if (getVal('darkLogoUrl')) setDarkLogoUrl(getVal('darkLogoUrl'));
                if (getVal('faviconUrl')) setFaviconUrl(getVal('faviconUrl'));
                // Editorial
                if (getVal('postsPerPage')) setPostsPerPage(String(getVal('postsPerPage')));
                if (getVal('maintenanceMode') !== undefined) {
                    setMaintenanceMode(getVal('maintenanceMode') === 'true' || getVal('maintenanceMode') === true);
                }
                if (getVal('enableLoadingSkeletons') !== undefined) {
                    setEnableLoadingSkeletons(getVal('enableLoadingSkeletons') === 'true' || getVal('enableLoadingSkeletons') === true);
                }
                if (getVal('commentsEnabled') !== undefined) {
                    setCommentsEnabled(getVal('commentsEnabled') === 'true' || getVal('commentsEnabled') === true);
                }
                if (getVal('commentModeration')) setCommentModeration(getVal('commentModeration'));
                if (getVal('allowUserArticleSubmission') !== undefined) {
                    setAllowUserArticleSubmission(getVal('allowUserArticleSubmission') === 'true' || getVal('allowUserArticleSubmission') === true);
                }
                if (getVal('breakingTickerSpeed')) setBreakingTickerSpeed(getVal('breakingTickerSpeed'));
                // Headquarters
                if (getVal('footerAbout')) setFooterAbout(getVal('footerAbout'));
                if (getVal('footerAddress')) setFooterAddress(getVal('footerAddress'));
                if (getVal('footerPhone')) setFooterPhone(getVal('footerPhone'));
                if (getVal('footerEmail')) setFooterEmail(getVal('footerEmail'));
                if (getVal('editorialInquiriesEmail')) setEditorialInquiriesEmail(getVal('editorialInquiriesEmail'));
                // Social
                if (getVal('socialTwitter')) setSocialTwitter(getVal('socialTwitter'));
                if (getVal('socialFacebook')) setSocialFacebook(getVal('socialFacebook'));
                if (getVal('socialLinkedin')) setSocialLinkedin(getVal('socialLinkedin'));
                if (getVal('socialYoutube')) setSocialYoutube(getVal('socialYoutube'));
                if (getVal('socialInstagram')) setSocialInstagram(getVal('socialInstagram'));
                if (getVal('rssFeedUrl')) setRssFeedUrl(getVal('rssFeedUrl'));
                // Security
                if (getVal('enforceHttps') !== undefined) {
                    setEnforceHttps(getVal('enforceHttps') === 'true' || getVal('enforceHttps') === true);
                }
                if (getVal('cacheMaxAge')) setCacheMaxAge(String(getVal('cacheMaxAge')));
                if (getVal('logRetentionDays')) setLogRetentionDays(String(getVal('logRetentionDays')));
            }
        } catch  {
            toast.error('Network error loading settings from database');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchSettings();
    }, []);
    const handleSave = async (e)=>{
        if (e) e.preventDefault();
        try {
            setIsSaving(true);
            const payload = {
                siteName,
                tagline,
                description,
                logoUrl,
                darkLogoUrl,
                faviconUrl,
                postsPerPage,
                maintenanceMode,
                enableLoadingSkeletons,
                commentsEnabled,
                commentModeration,
                allowUserArticleSubmission,
                breakingTickerSpeed,
                footerAbout,
                footerAddress,
                footerPhone,
                footerEmail,
                editorialInquiriesEmail,
                socialTwitter,
                socialFacebook,
                socialLinkedin,
                socialYoutube,
                socialInstagram,
                rssFeedUrl,
                enforceHttps,
                cacheMaxAge,
                logRetentionDays
            };
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('All settings and brand assets persisted to MongoDB');
            } else {
                toast.error(data.error || 'Failed to save settings');
            }
        } catch  {
            toast.error('Network error saving settings');
        } finally{
            setIsSaving(false);
        }
    };
    if (loading) {
        return <div className="py-24 text-center space-y-3">
        <RefreshCwIcon className="mx-auto size-6 animate-spin text-muted-foreground"/>
        <p className="text-xs text-muted-foreground">Loading newsroom settings from MongoDB...</p>
      </div>;
    }
    return <div className="space-y-6 pb-12">
      { /* Header */ }
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">CMS & Newsroom Settings</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              Production Controls
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Control publication parameters, branding logos, editorial rules, and syndication feeds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={fetchSettings}>
            <RefreshCwIcon className="size-3.5"/> Refresh
          </Button>
          <Button size="sm" onClick={()=>handleSave()} disabled={isSaving} className="gap-1.5 text-xs font-medium">
            {isSaving ? <Loader2Icon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            Save All Changes
          </Button>
        </div>
      </div>

      {maintenanceMode && <div className="p-4 rounded-lg border border-foreground bg-foreground text-background flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="size-4 shrink-0"/>
            <span className="font-semibold">Maintenance Mode Active:</span>
            <span>Public readers will see a 503 maintenance broadsheet. Staff retains full access.</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs text-background bg-foreground border-background hover:bg-background hover:text-foreground h-7" onClick={()=>setMaintenanceMode(false)}>
            Disable Now
          </Button>
        </div>}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General & Branding</TabsTrigger>
          <TabsTrigger value="editorial">Editorial & Wire</TabsTrigger>
          <TabsTrigger value="contact">Headquarters & Desk</TabsTrigger>
          <TabsTrigger value="social">Social & Syndication</TabsTrigger>
          <TabsTrigger value="security">Security & Caching</TabsTrigger>
        </TabsList>

        { /* Tab 1: General & Branding with Logo & Favicon ImagePicker */ }
        <TabsContent value="general" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Publication Identity</CardTitle>
              <CardDescription className="text-xs">
                Official title and founding Latin motto used in search engines and masthead cards.
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mission Statement / About Summary</Label>
                <Textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} className="text-xs leading-relaxed"/>
              </div>
            </CardContent>
          </Card>

          { /* Logo and Favicon Asset Options with ImagePicker */ }
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Brand Logos & Publication Favicon</CardTitle>
              <CardDescription className="text-xs">
                Upload PNG/SVG assets to Cloudinary or select existing files from your Media Library.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              { /* Light Mode Logo */ }
              <div className="border-b pb-5">
                <ImagePicker label="Light Mode Masthead Logo" value={logoUrl} onChange={setLogoUrl} aspectRatio="banner" description="Vector SVG or PNG banner logo for daylight broadsheet view. Upload file or choose from Media Library."/>
              </div>

              { /* Dark Mode Logo */ }
              <div className="border-b pb-5">
                <ImagePicker label="Dark Mode Masthead Logo" value={darkLogoUrl} onChange={setDarkLogoUrl} aspectRatio="banner" description="High-contrast inverted SVG or PNG logo for nighttime view. Upload file or choose from Media Library."/>
              </div>

              { /* Favicon */ }
              <div>
                <ImagePicker label="Browser Favicon & App Icon" value={faviconUrl} onChange={setFaviconUrl} aspectRatio="square" description="1:1 square icon (.ico, .png, .svg) appearing on browser tabs and shortcuts. Upload file or choose from Media Library."/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        { /* Tab 2: Editorial & Wire */ }
        <TabsContent value="editorial" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Wire Parameters & Reading Experience</CardTitle>
              <CardDescription className="text-xs">
                Configure article density, audience comments, and maintenance status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Dispatches Per Page (Index Feed)</Label>
                  <Select value={postsPerPage} onValueChange={(val)=>{
        if (val) setPostsPerPage(val);
    }}>
                    <SelectTrigger className="text-xs">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 Dispatches (Compact)</SelectItem>
                      <SelectItem value="12">12 Dispatches (Standard Broadsheet)</SelectItem>
                      <SelectItem value="18">18 Dispatches (Dense Newsroom)</SelectItem>
                      <SelectItem value="24">24 Dispatches (Archive View)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Breaking Alert Ticker Speed</Label>
                  <Select value={breakingTickerSpeed} onValueChange={(val)=>{
        if (val) setBreakingTickerSpeed(val);
    }}>
                    <SelectTrigger className="text-xs">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow (45s cycle)</SelectItem>
                      <SelectItem value="medium">Medium (25s cycle)</SelectItem>
                      <SelectItem value="fast">Rapid Wire (12s cycle)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Reader Comments & Discussion</div>
                  <div className="text-muted-foreground text-[11px]">Enable article comment threads across dispatches.</div>
                </div>
                <Switch checked={commentsEnabled} onCheckedChange={setCommentsEnabled}/>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Loading Skeletons & Transitions</div>
                  <div className="text-muted-foreground text-[11px]">Render smooth content skeletons while stories load.</div>
                </div>
                <Switch checked={enableLoadingSkeletons} onCheckedChange={setEnableLoadingSkeletons}/>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Public Contributor Submissions</div>
                  <div className="text-muted-foreground text-[11px]">Allow verified external journalists to submit drafts.</div>
                </div>
                <Switch checked={allowUserArticleSubmission} onCheckedChange={setAllowUserArticleSubmission}/>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Maintenance Mode Lock</div>
                  <div className="text-muted-foreground text-[11px]">Temporarily lock front-facing portal for infrastructure upgrades.</div>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode}/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        { /* Tab 3: Headquarters & Contact */ }
        <TabsContent value="contact" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Headquarters & Editorial Inquiries</CardTitle>
              <CardDescription className="text-xs">
                Official postal address, telephone lines, and desk inboxes displayed on legal pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Central Newsroom Desk Email</Label>
                  <Input value={footerEmail} onChange={(e)=>setFooterEmail(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Editor-in-Chief Inquiries Email</Label>
                  <Input value={editorialInquiriesEmail} onChange={(e)=>setEditorialInquiriesEmail(e.target.value)} className="text-xs font-mono"/>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Central Telephone Wire</Label>
                  <Input value={footerPhone} onChange={(e)=>setFooterPhone(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Global Bureau Physical Address</Label>
                  <Input value={footerAddress} onChange={(e)=>setFooterAddress(e.target.value)} className="text-xs"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Institutional Boilerplate Attribution</Label>
                <Textarea rows={2} value={footerAbout} onChange={(e)=>setFooterAbout(e.target.value)} className="text-xs resize-none"/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        { /* Tab 4: Social & Syndication */ }
        <TabsContent value="social" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Official Social Channels & Feeds</CardTitle>
              <CardDescription className="text-xs">
                Syndicate articles directly to verified newsroom distribution handles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">X (formerly Twitter)</Label>
                  <Input value={socialTwitter} onChange={(e)=>setSocialTwitter(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">LinkedIn Media Organization</Label>
                  <Input value={socialLinkedin} onChange={(e)=>setSocialLinkedin(e.target.value)} className="text-xs font-mono"/>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">YouTube Dispatch Channel</Label>
                  <Input value={socialYoutube} onChange={(e)=>setSocialYoutube(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Facebook Page</Label>
                  <Input value={socialFacebook} onChange={(e)=>setSocialFacebook(e.target.value)} className="text-xs font-mono"/>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Instagram Channel</Label>
                  <Input value={socialInstagram} onChange={(e)=>setSocialInstagram(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">RSS Syndication Feed Endpoint</Label>
                  <Input value={rssFeedUrl} onChange={(e)=>setRssFeedUrl(e.target.value)} className="text-xs font-mono"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        { /* Tab 5: Security & Caching */ }
        <TabsContent value="security" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Security & Edge Caching</CardTitle>
              <CardDescription className="text-xs">
                Fine-tune CDN edge caching headers, HTTPS enforcement, and audit logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Strict HTTPS & HSTS Enforcement</div>
                  <div className="text-muted-foreground text-[11px]">Require all readers and API requests to use TLS 1.3 encryption.</div>
                </div>
                <Switch checked={enforceHttps} onCheckedChange={setEnforceHttps}/>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Edge CDN Cache Max Age (Seconds)</Label>
                  <Input value={cacheMaxAge} onChange={(e)=>setCacheMaxAge(e.target.value)} className="text-xs font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Audit Log Retention Policy (Days)</Label>
                  <Input value={logRetentionDays} onChange={(e)=>setLogRetentionDays(e.target.value)} className="text-xs font-mono"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
