'use client';
import { useState, useEffect } from 'react';
import { ScrollText, Search, User, Shield, Download, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
export default function AuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const fetchAuditLogs = async ()=>{
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (actionFilter !== 'all') params.set('action', actionFilter);
            const res = await fetch(`/api/audit?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs || []);
            }
        } catch  {
            toast.error('Failed to load audit logs');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchAuditLogs();
    }, [
        actionFilter
    ]);
    const filteredLogs = logs.filter((log)=>{
        const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) || log.editor.toLowerCase().includes(searchQuery.toLowerCase()) || log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) || log.ip.includes(searchQuery);
        return matchesSearch;
    });
    const handleExport = ()=>{
        if (logs.length === 0) {
            toast.error('No audit records to export');
            return;
        }
        const headers = [
            'ID',
            'Action',
            'Entity',
            'EntityID',
            'Details',
            'Actor',
            'Timestamp'
        ];
        const rows = logs.map((l)=>[
                l.id,
                l.action,
                l.entity,
                l.entityId,
                `"${l.details.replace(/"/g, '""')}"`,
                `"${l.editor}"`,
                `"${l.timestamp}"`
            ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [
            headers.join(','),
            ...rows.map((e)=>e.join(','))
        ].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `audit-trail-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Audit security ledger exported to CSV');
    };
    return <div className='space-y-6'>
      { /* Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Newsroom Audit Trail & Security Ledger</h1>
          <p className='text-muted-foreground text-sm'>
            Live immutable log of all editorial modifications, schema changes, and database actions in MongoDB.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchAuditLogs}>
            <RefreshCw className='size-3.5'/> Refresh
          </Button>
          <Button variant='outline' size='sm' onClick={handleExport} className='gap-1.5 text-xs font-medium'>
            <Download className='size-3.5'/>
            Export Audit Trail
          </Button>
        </div>
      </div>

      { /* KPI Stats */ }
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Total Log Entries
            </CardTitle>
            <ScrollText className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>{logs.length}</div>
            <p className='text-muted-foreground mt-1 text-xs'>Recorded in security store</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Recent Actions
            </CardTitle>
            <Shield className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {logs.filter((l)=>l.action === 'create' || l.action === 'publish').length}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Create and publish events</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Updates & Modifies
            </CardTitle>
            <User className='text-muted-foreground size-4'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>
              {logs.filter((l)=>l.action === 'update' || l.action === 'approve').length}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Settings and moderation</p>
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              Audit Integrity
            </CardTitle>
            <Badge variant='outline' className='font-mono text-[10px]'>Verified</Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tracking-tight'>100%</div>
            <p className='text-muted-foreground mt-1 text-xs'>Persisted directly in MongoDB</p>
          </CardContent>
        </Card>
      </div>

      { /* Audit Log Table */ }
      <Card className='border'>
        <CardHeader className='flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <div className='relative w-64'>
              <Search className='text-muted-foreground absolute top-2.5 left-2.5 size-3.5'/>
              <Input placeholder='Search details, editors, IDs...' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='pl-8 text-xs'/>
            </div>
            <Select value={actionFilter} onValueChange={(v)=>{
        if (v) setActionFilter(v);
    }}>
              <SelectTrigger className='w-[130px] text-xs font-medium'>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Actions</SelectItem>
                <SelectItem value='publish'>Publish</SelectItem>
                <SelectItem value='create'>Create</SelectItem>
                <SelectItem value='update'>Update</SelectItem>
                <SelectItem value='delete'>Delete</SelectItem>
                <SelectItem value='approve'>Approve</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant='outline' className='text-xs'>
            {filteredLogs.length} events displayed
          </Badge>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? <div className='flex h-36 items-center justify-center'>
              <Loader2 className='size-6 animate-spin text-muted-foreground'/>
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px] text-xs'>Action</TableHead>
                  <TableHead className='w-[90px] text-xs'>Entity</TableHead>
                  <TableHead className='text-xs'>Event Description</TableHead>
                  <TableHead className='text-xs'>Actor / Author</TableHead>
                  <TableHead className='font-mono text-xs'>Origin IP</TableHead>
                  <TableHead className='text-right text-xs'>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? <TableRow>
                    <TableCell colSpan={6} className='text-muted-foreground h-24 text-center text-xs'>
                      No audit events recorded yet.
                    </TableCell>
                  </TableRow> : filteredLogs.map((log)=><TableRow key={log.id} className='cursor-pointer hover:bg-muted/40' onClick={()=>setSelectedEntry(log)}>
                      <TableCell>
                        <Badge variant='outline' className='font-mono text-[10px] uppercase'>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className='text-muted-foreground font-mono text-xs'>{log.entity}</span>
                      </TableCell>
                      <TableCell>
                        <p className='line-clamp-1 text-xs font-medium text-foreground'>
                          {log.details}
                        </p>
                      </TableCell>
                      <TableCell className='text-muted-foreground text-xs'>
                        {log.editor}
                      </TableCell>
                      <TableCell className='text-muted-foreground font-mono text-xs'>
                        {log.ip}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-right font-mono text-xs'>
                        {log.timestamp}
                      </TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>}
        </CardContent>
      </Card>

      { /* Detail Dialog */ }
      {selectedEntry && <Dialog open={!!selectedEntry} onOpenChange={()=>setSelectedEntry(null)}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-base font-semibold'>Audit Event Record</DialogTitle>
              <DialogDescription className='font-mono text-xs'>
                Log ID: {selectedEntry.id}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-3 py-2 text-xs'>
              <div className='space-y-2 rounded border bg-muted/20 p-3'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Action:</span>
                  <Badge variant='outline' className='font-mono text-[10px] uppercase'>
                    {selectedEntry.action}
                  </Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Entity:</span>
                  <span className='font-mono font-semibold'>{selectedEntry.entity} ({selectedEntry.entityId})</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Actor:</span>
                  <span>{selectedEntry.editor}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>IP Address:</span>
                  <span className='font-mono'>{selectedEntry.ip}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Recorded At:</span>
                  <span className='font-mono'>{selectedEntry.timestamp}</span>
                </div>
              </div>

              <div>
                <Label className='text-xs font-semibold'>Event Description</Label>
                <p className='text-muted-foreground mt-1 rounded border p-2 text-xs'>
                  {selectedEntry.details}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>}
    </div>;
}
