'use client';
import { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Search, Copy, Trash2, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
export default function RedirectsPage() {
    const [redirects, setRedirects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // New rule form state
    const [newSource, setNewSource] = useState('');
    const [newTarget, setNewTarget] = useState('');
    const [newStatus, setNewStatus] = useState('301');
    const [newNote, setNewNote] = useState('');
    const fetchRedirects = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/redirects');
            const data = await res.json();
            if (data.success) {
                setRedirects(data.redirects || []);
            }
        } catch  {
            toast.error('Failed to load redirect rules');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchRedirects();
    }, []);
    const filteredRules = redirects.filter((r)=>{
        const matchesSearch = r.source.toLowerCase().includes(searchQuery.toLowerCase()) || r.target.toLowerCase().includes(searchQuery.toLowerCase()) || r.note.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (filterType === '301') return r.statusCode === 301;
        if (filterType === '302') return r.statusCode === 302;
        return true;
    });
    const totalHits = redirects.reduce((sum, r)=>sum + r.hits, 0);
    const handleToggle = async (id, currentStatus)=>{
        try {
            const res = await fetch(`/api/redirects/${id}`, {
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
                setRedirects((prev)=>prev.map((r)=>r.id === id ? {
                            ...r,
                            isActive: !currentStatus
                        } : r));
                toast.success('Redirect rule status updated');
            } else {
                toast.error(data.error || 'Failed to update rule');
            }
        } catch  {
            toast.error('Network error updating redirect rule');
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm('Are you sure you want to permanently delete this redirect rule?')) return;
        try {
            const res = await fetch(`/api/redirects/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setRedirects((prev)=>prev.filter((r)=>r.id !== id));
                toast.success('Redirect rule deleted from database');
            } else {
                toast.error(data.error || 'Failed to delete rule');
            }
        } catch  {
            toast.error('Network error deleting redirect rule');
        }
    };
    const handleCreateRule = async (e)=>{
        e.preventDefault();
        if (!newSource.trim() || !newTarget.trim()) {
            toast.error('Source path and target destination are required');
            return;
        }
        const cleanSource = newSource.trim().startsWith('/') ? newSource.trim() : `/${newSource.trim()}`;
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/redirects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: cleanSource,
                    target: newTarget.trim(),
                    statusCode: parseInt(newStatus, 10),
                    note: newNote.trim() || 'Manual redirect rule'
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('New redirect rule saved to database');
                setIsDialogOpen(false);
                setNewSource('');
                setNewTarget('');
                setNewNote('');
                fetchRedirects();
            } else {
                toast.error(data.error || 'Failed to create redirect rule');
            }
        } catch  {
            toast.error('Network error creating redirect rule');
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleCopy = (text)=>{
        navigator.clipboard.writeText(text);
        toast.success('Path copied to clipboard');
    };
    return <div className='space-y-6'>
      { /* Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>URL Redirect Engine</h1>
          <p className='text-muted-foreground text-sm'>
            Preserve SEO equity and prevent 404 dead links with 301 permanent and 302 temporary URL rules.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchRedirects}>
            <RefreshCw className='size-3.5'/> Refresh
          </Button>
          <Button size='sm' onClick={()=>setIsDialogOpen(true)} className='gap-1.5 text-xs font-medium'>
            <Plus className='size-4'/>
            Add Redirect Rule
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-base font-semibold'>Create Redirect Rule</DialogTitle>
              <DialogDescription className='text-xs'>
                Incoming traffic requesting the source path will be forwarded to the target destination.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRule} className='space-y-4 py-2'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Source Path *</Label>
                <Input placeholder='/old-news/legacy-slug' value={newSource} onChange={(e)=>setNewSource(e.target.value)} className='font-mono text-xs' required/>
                <p className='text-muted-foreground text-[10px]'>Relative path starting with a forward slash.</p>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Target Destination *</Label>
                <Input placeholder='/articles/new-slug or https://...' value={newTarget} onChange={(e)=>setNewTarget(e.target.value)} className='font-mono text-xs' required/>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>HTTP Status Code</Label>
                <Select value={newStatus} onValueChange={(v)=>{
        if (v) setNewStatus(v);
    }}>
                  <SelectTrigger className='text-xs font-medium'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='301'>301 Moved Permanently (Recommended for SEO)</SelectItem>
                    <SelectItem value='302'>302 Found / Temporary Redirect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Editorial Note / Reason</Label>
                <Input placeholder='e.g. Headline revised after facts update' value={newNote} onChange={(e)=>setNewNote(e.target.value)} className='text-xs'/>
              </div>

              <DialogFooter className='pt-2'>
                <Button type='button' variant='outline' size='sm' onClick={()=>setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' size='sm' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='mr-1.5 size-3.5 animate-spin'/>}
                  Activate Rule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      { /* Summary KPI Cards */ }
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Total Rules
            </CardTitle>
            <ArrowRightLeft className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>{redirects.length}</div>
            <p className='text-muted-foreground mt-1 text-xs'>Active forwarding endpoints</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              301 Permanent
            </CardTitle>
            <Badge variant='outline' className='font-mono text-[10px]'>SEO Equity</Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {redirects.filter((r)=>r.statusCode === 301).length}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Preserves search rankings</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              302 Temporary
            </CardTitle>
            <Badge variant='outline' className='font-mono text-[10px]'>Campaign</Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {redirects.filter((r)=>r.statusCode === 302).length}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Short-term promos & shifts</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Hits Forwarded
            </CardTitle>
            <CheckCircle2 className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>{totalHits.toLocaleString()}</div>
            <p className='text-muted-foreground mt-1 text-xs'>404 errors prevented</p>
          </CardContent>
        </Card>
      </div>

      { /* Rules Table Card */ }
      <Card className='border'>
        <CardHeader className='flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <div className='relative w-64'>
              <Search className='text-muted-foreground absolute top-2.5 left-2.5 size-3.5'/>
              <Input placeholder='Search paths or notes...' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='pl-8 text-xs'/>
            </div>
            <Select value={filterType} onValueChange={(v)=>{
        if (v) setFilterType(v);
    }}>
              <SelectTrigger className='w-[120px] text-xs font-medium'>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='301'>301 Only</SelectItem>
                <SelectItem value='302'>302 Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant='outline' className='text-xs'>
            {filteredRules.length} of {redirects.length} rules
          </Badge>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? <div className='flex h-36 items-center justify-center'>
              <Loader2 className='size-6 animate-spin text-muted-foreground'/>
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[90px] text-xs'>Type</TableHead>
                  <TableHead className='text-xs'>Source Path & Destination</TableHead>
                  <TableHead className='text-xs'>Note</TableHead>
                  <TableHead className='text-right text-xs'>Hits</TableHead>
                  <TableHead className='text-right text-xs'>Last Forward</TableHead>
                  <TableHead className='w-[80px] text-center text-xs'>Status</TableHead>
                  <TableHead className='w-[60px] text-center text-xs'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.length === 0 ? <TableRow>
                    <TableCell colSpan={7} className='text-muted-foreground h-24 text-center text-xs'>
                      No redirect rules found in database.
                    </TableCell>
                  </TableRow> : filteredRules.map((rule)=><TableRow key={rule.id} className='hover:bg-muted/40'>
                      <TableCell>
                        <Badge variant='outline' className='font-mono text-[10px]'>
                          {rule.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground'>
                            <span>{rule.source}</span>
                            <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground size-5' onClick={()=>handleCopy(rule.source)}>
                              <Copy className='size-3'/>
                            </Button>
                          </div>
                          <div className='text-muted-foreground flex items-center gap-1.5 font-mono text-[11px]'>
                            <span className='text-foreground/60'>→</span>
                            <span>{rule.target}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground text-xs'>
                        {rule.note}
                      </TableCell>
                      <TableCell className='text-right font-mono text-xs font-semibold'>
                        {rule.hits.toLocaleString()}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-right font-mono text-xs'>
                        {rule.lastAccessed}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Switch checked={rule.isActive} onCheckedChange={()=>handleToggle(rule.id, rule.isActive)}/>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground size-7' onClick={()=>handleDelete(rule.id)}>
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
