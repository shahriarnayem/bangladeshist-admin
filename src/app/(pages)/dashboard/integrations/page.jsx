'use client';
import { useState } from 'react';
import { Save, Code, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
export default function IntegrationsPage() {
    // Tracking & Analytics
    const [ga4Id, setGa4Id] = useState('G-BDHIST2026');
    const [gtmId, setGtmId] = useState('GTM-NW82710');
    const [cfToken, setCfToken] = useState('cf_analytics_9318bdf82');
    const [metaPixelId, setMetaPixelId] = useState('8291048201948');
    const [headScript, setHeadScript] = useState('<!-- Custom newsroom preconnect -->\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />');
    const [bodyScript, setBodyScript] = useState('<!-- Custom live chat or telemetric beacon -->');
    // OAuth Credentials
    const [googleClientId, setGoogleClientId] = useState('981723489102-vbd92.apps.googleusercontent.com');
    const [googleSecret, setGoogleSecret] = useState('GOCSPX-a982bdf821948bd91');
    const [fbAppId, setFbAppId] = useState('918239018290');
    const [fbSecret, setFbSecret] = useState('d98234bc981240981bdf');
    const handleSaveTracking = (e)=>{
        e.preventDefault();
        toast.success('Analytics and tracking integrations saved');
    };
    const handleSaveAuth = (e)=>{
        e.preventDefault();
        toast.success('OAuth credentials securely encrypted and stored');
    };
    return <div className="space-y-6">
      { /* Page Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Third-Party Newsroom Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Configure telemetry tracking, OAuth login providers, and header script injections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            Production Environment
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tracking">Analytics & Tracking Scripts</TabsTrigger>
          <TabsTrigger value="oauth">OAuth & Social Login</TabsTrigger>
          <TabsTrigger value="syndication">Distribution & Syndication</TabsTrigger>
        </TabsList>

        { /* Tab 1: Tracking & Scripts */ }
        <TabsContent value="tracking" className="space-y-6">
          <form onSubmit={handleSaveTracking} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              { /* Google Analytics & GTM */ }
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Google Tag & Analytics</CardTitle>
                  <CardDescription className="text-xs">
                    Connect GA4 and Google Tag Manager containers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Google Analytics 4 Measurement ID</Label>
                    <Input placeholder="G-XXXXXXXXXX" value={ga4Id} onChange={(e)=>setGa4Id(e.target.value)} className="font-mono text-xs"/>
                    <p className="text-[11px] text-muted-foreground">Automatically injects gtag.js on all public routes.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Google Tag Manager Container ID</Label>
                    <Input placeholder="GTM-XXXXXXX" value={gtmId} onChange={(e)=>setGtmId(e.target.value)} className="font-mono text-xs"/>
                  </div>
                </CardContent>
              </Card>

              { /* Cloudflare & Meta Pixel */ }
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Cloudflare & Meta (Facebook)</CardTitle>
                  <CardDescription className="text-xs">
                    Privacy-preserving telemetry and Meta Conversions API.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Cloudflare Web Analytics Token</Label>
                    <Input placeholder="Beacon token" value={cfToken} onChange={(e)=>setCfToken(e.target.value)} className="font-mono text-xs"/>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Meta Pixel ID</Label>
                    <Input placeholder="Pixel ID" value={metaPixelId} onChange={(e)=>setMetaPixelId(e.target.value)} className="font-mono text-xs"/>
                  </div>
                </CardContent>
              </Card>
            </div>

            { /* Custom Scripts Injection */ }
            <Card className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Code className="size-4 text-foreground"/>
                  <div>
                    <CardTitle className="text-base font-semibold">Custom Code Injection</CardTitle>
                    <CardDescription className="text-xs">
                      Embed verified third-party scripts into the document head or footer body.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Header Scripts ({'<head>'})</Label>
                  <Textarea rows={4} value={headScript} onChange={(e)=>setHeadScript(e.target.value)} className="font-mono text-xs"/>
                  <p className="text-[11px] text-muted-foreground">Injected before the closing {'</head>'} tag.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Body Scripts (Before {'</body>'})</Label>
                  <Textarea rows={3} value={bodyScript} onChange={(e)=>setBodyScript(e.target.value)} className="font-mono text-xs"/>
                  <p className="text-[11px] text-muted-foreground">Injected before the closing {'</body>'} tag.</p>
                </div>

                <Button type="submit" size="sm" className="gap-1.5 text-xs font-medium">
                  <Save className="size-3.5"/>
                  Save Tracking Configurations
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        { /* Tab 2: OAuth Credentials */ }
        <TabsContent value="oauth" className="space-y-6">
          <form onSubmit={handleSaveAuth} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              { /* Google OAuth */ }
              <Card className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">Google Sign-In (NextAuth)</CardTitle>
                      <CardDescription className="text-xs">
                        Allow reader login and 1-click subscription via Google.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Google Client ID</Label>
                    <Input value={googleClientId} onChange={(e)=>setGoogleClientId(e.target.value)} className="font-mono text-xs"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Google Client Secret</Label>
                    <Input type="password" value={googleSecret} onChange={(e)=>setGoogleSecret(e.target.value)} className="font-mono text-xs"/>
                  </div>
                  <div className="rounded border bg-muted/20 p-2 text-[11px] text-muted-foreground">
                    Authorized redirect URI: <code className="font-mono text-foreground">https://thechronicle.press/api/auth/callback/google</code>
                  </div>
                </CardContent>
              </Card>

              { /* Facebook OAuth */ }
              <Card className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">Facebook Login</CardTitle>
                      <CardDescription className="text-xs">
                        Allow reader identity verification for comments via Facebook.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Facebook App ID</Label>
                    <Input value={fbAppId} onChange={(e)=>setFbAppId(e.target.value)} className="font-mono text-xs"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Facebook App Secret</Label>
                    <Input type="password" value={fbSecret} onChange={(e)=>setFbSecret(e.target.value)} className="font-mono text-xs"/>
                  </div>
                  <div className="rounded border bg-muted/20 p-2 text-[11px] text-muted-foreground">
                    Authorized redirect URI: <code className="font-mono text-foreground">https://thechronicle.press/api/auth/callback/facebook</code>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button type="submit" size="sm" className="gap-1.5 text-xs font-medium">
              <Key className="size-3.5"/>
              Save OAuth Credentials
            </Button>
          </form>
        </TabsContent>

        { /* Tab 3: Syndication */ }
        <TabsContent value="syndication" className="space-y-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">News Syndication & Push Feeds</CardTitle>
              <CardDescription className="text-xs">
                Broadcast articles to news aggregators and institutional wires.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Google Publisher Center RSS Feed</div>
                  <div className="text-[11px] text-muted-foreground">Automated ingestion into Google News app.</div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Apple News Format (ANF) Feed</div>
                  <div className="text-[11px] text-muted-foreground">Channel feed endpoint for iOS readers.</div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Telegram Newsroom Channel Auto-Post</div>
                  <div className="text-[11px] text-muted-foreground">Broadcast breaking news dispatches directly to Telegram channel.</div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">Connected</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
