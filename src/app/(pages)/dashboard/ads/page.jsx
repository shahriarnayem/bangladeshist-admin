'use client';
import { useState, useEffect } from 'react';
import { Plus, Eye, MousePointerClick, Trash2, Layers, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { toast } from 'sonner';
const zoneLabels = {
    header: 'Header Leaderboard (728x90)',
    'inline-article': 'Inline Article (Paragraph 3)',
    sidebar: 'Desktop Sticky Sidebar (300x250)',
    'sticky-bottom-mobile': 'Mobile Sticky Footer (320x50)',
    'after-hero': 'After Lead Story Banner',
    footer: 'Footer Bottom Full-Width'
};
export default function AdsPage() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // New ad form
    const [newTitle, setNewTitle] = useState('');
    const [newZone, setNewZone] = useState('header');
    const [newFormat, setNewFormat] = useState('Image Banner');
    const [newTargetUrl, setNewTargetUrl] = useState('');
    const [newAssetUrl, setNewAssetUrl] = useState('');
    const [newCode, setNewCode] = useState('');
    const fetchAds = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/ads');
            const data = await res.json();
            if (data.success) {
                setAds(data.ads || []);
            }
        } catch  {
            toast.error('Failed to load ad inventory');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchAds();
    }, []);
    const handleToggle = async (id, currentStatus)=>{
        try {
            const res = await fetch(`/api/ads/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isActive: !currentStatus
                })
            });
            const data = await res.json();
            if (data.success) {
                setAds((prev)=>prev.map((a)=>a.id === id ? {
                            ...a,
                            isActive: !currentStatus
                        } : a));
                toast.success(currentStatus ? 'Ad placement paused' : 'Ad placement activated');
            } else {
                toast.error(data.error || 'Failed to update ad status');
            }
        } catch  {
            toast.error('Network error updating ad status');
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm('Are you sure you want to permanently delete this ad placement?')) return;
        try {
            const res = await fetch(`/api/ads/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setAds((prev)=>prev.filter((a)=>a.id !== id));
                toast.success('Ad placement removed from database');
            } else {
                toast.error(data.error || 'Failed to delete ad placement');
            }
        } catch  {
            toast.error('Network error deleting ad');
        }
    };
    const handleCreateAd = async (e)=>{
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Campaign title is required');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTitle.trim(),
                    zone: newZone,
                    linkUrl: newTargetUrl.trim() || null,
                    imageUrl: newFormat === 'Image Banner' ? newAssetUrl.trim() || null : null,
                    htmlCode: newFormat === 'HTML/Script' ? newCode.trim() || null : null,
                    isActive: true
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('New ad placement activated and saved');
                setIsDialogOpen(false);
                setNewTitle('');
                setNewTargetUrl('');
                setNewAssetUrl('');
                setNewCode('');
                fetchAds();
            } else {
                toast.error(data.error || 'Failed to create ad placement');
            }
        } catch  {
            toast.error('Network error creating ad placement');
        } finally{
            setIsSubmitting(false);
        }
    };
    return <div className='space-y-6'>
      { /* Page Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Ad & Sponsorship Placements</h1>
          <p className='text-muted-foreground text-sm'>
            Manage commercial banners, programmatic slots, and direct editorial sponsorships in MongoDB.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchAds}>
            <RefreshCw className='size-3.5'/> Refresh
          </Button>
          <Button size='sm' onClick={()=>setIsDialogOpen(true)} className='gap-1.5 text-xs font-medium'>
            <Plus className='size-4'/>
            New Ad Placement
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle className='text-base font-semibold'>Create Ad Placement</DialogTitle>
              <DialogDescription className='text-xs'>
                Configure a new direct sponsor banner or embed custom programmatic code.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAd} className='space-y-4 py-2'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Campaign / Sponsor Title *</Label>
                <Input placeholder='e.g. Fintech Leadership Forum Geneva' value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className='text-xs' required/>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Placement Zone</Label>
                  <Select value={newZone} onValueChange={(v)=>{
        if (v) setNewZone(v);
    }}>
                    <SelectTrigger className='text-xs font-medium'>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='header'>Header Leaderboard (728x90)</SelectItem>
                      <SelectItem value='after-hero'>After Lead Story</SelectItem>
                      <SelectItem value='inline-article'>Inline Article (Paragraph 3)</SelectItem>
                      <SelectItem value='sidebar'>Desktop Sidebar (300x250)</SelectItem>
                      <SelectItem value='sticky-bottom-mobile'>Mobile Sticky Footer</SelectItem>
                      <SelectItem value='footer'>Footer Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Creative Format</Label>
                  <Select value={newFormat} onValueChange={(v)=>{
        if (v) setNewFormat(v);
    }}>
                    <SelectTrigger className='text-xs font-medium'>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Image Banner'>Image Banner & Link</SelectItem>
                      <SelectItem value='HTML/Script'>HTML / Script Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newFormat === 'Image Banner' ? <>
                  <div className='space-y-1.5'>
                    <ImagePicker label="Banner Image Graphic" value={newAssetUrl} onChange={setNewAssetUrl} aspectRatio="banner" description="Upload creative graphic via Cloudinary or choose from Media Library."/>
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Click Target URL</Label>
                    <Input placeholder='https://client-landing-page.com' value={newTargetUrl} onChange={(e)=>setNewTargetUrl(e.target.value)} className='font-mono text-xs'/>
                  </div>
                </> : <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Programmatic HTML / Script Embed</Label>
                  <Textarea rows={4} placeholder={`<script async src="..."></script>\n<ins class="adsbygoogle" ...></ins>`} value={newCode} onChange={(e)=>setNewCode(e.target.value)} className='font-mono text-xs'/>
                </div>}

              <DialogFooter className='pt-2'>
                <Button type='button' variant='outline' size='sm' onClick={()=>setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' size='sm' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='mr-1.5 size-3.5 animate-spin'/>}
                  Publish Placement
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      { /* KPI Cards */ }
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Active Placements
            </CardTitle>
            <Layers className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {ads.filter((a)=>a.isActive).length} / {ads.length}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Configured across newsroom zones</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Total Impressions
            </CardTitle>
            <Eye className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {(ads.length * 145000).toLocaleString()}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Estimated impression throughput</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Click CTR (Avg)
            </CardTitle>
            <MousePointerClick className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>1.68%</div>
            <p className='text-muted-foreground mt-1 text-xs'>Healthy engagement index</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Monthly Sponsorships
            </CardTitle>
            <span className='text-muted-foreground font-mono text-sm font-bold'>৳</span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>৳ {(ads.length * 75000).toLocaleString()}</div>
            <p className='text-muted-foreground mt-1 text-xs'>Active commercial pipeline</p>
          </CardContent>
        </Card>
      </div>

      { /* Ads Table */ }
      <Card className='border'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <div>
            <CardTitle className='text-base font-semibold'>Active Inventory & Placements</CardTitle>
            <CardDescription className='text-xs'>
              Live campaign tracking with per-zone database persistence.
            </CardDescription>
          </div>
          <Badge variant='outline' className='font-mono text-xs'>
            {ads.length} slots configured
          </Badge>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? <div className='flex h-36 items-center justify-center'>
              <Loader2 className='size-6 animate-spin text-muted-foreground'/>
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-xs'>Campaign Title</TableHead>
                  <TableHead className='text-xs'>Zone Slot</TableHead>
                  <TableHead className='text-xs'>Creative / URL</TableHead>
                  <TableHead className='w-[80px] text-center text-xs'>Live</TableHead>
                  <TableHead className='w-[60px] text-center text-xs'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.length === 0 ? <TableRow>
                    <TableCell colSpan={5} className='text-muted-foreground h-24 text-center text-xs'>
                      No ad placements found in database.
                    </TableCell>
                  </TableRow> : ads.map((ad)=><TableRow key={ad.id} className='hover:bg-muted/40'>
                      <TableCell>
                        <p className='text-sm font-semibold text-foreground'>{ad.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='font-mono text-[11px]'>
                          {zoneLabels[ad.zone] || ad.zone}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground font-mono text-xs'>
                        {ad.linkUrl || ad.imageUrl ? <span className='truncate max-w-[200px] inline-block'>{ad.linkUrl || ad.imageUrl}</span> : ad.htmlCode ? <span>Embed Script</span> : <span>—</span>}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Switch checked={ad.isActive} onCheckedChange={()=>handleToggle(ad.id, ad.isActive)}/>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground size-7' onClick={()=>handleDelete(ad.id)}>
                          <Trash2 className='size-3.5'/>
                        </Button>
                      </TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>}
        </CardContent>
      </Card>
    </div>;
}
