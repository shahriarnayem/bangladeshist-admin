'use client';
import { useState, useEffect } from 'react';
import { Terminal, Search, Download, Trash2, RefreshCw, Radio, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('ALL');
    const [serviceFilter, setServiceFilter] = useState('ALL');
    const [autoScroll, setAutoScroll] = useState(true);
    const fetchLogs = async ()=>{
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (levelFilter !== 'ALL') params.set('level', levelFilter);
            if (serviceFilter !== 'ALL') params.set('service', serviceFilter);
            const res = await fetch(`/api/logs?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs || []);
            }
        } catch  {
            toast.error('Failed to load system logs');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchLogs();
    }, [
        levelFilter,
        serviceFilter
    ]);
    const filteredLogs = logs.filter((log)=>{
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || log.service.toLowerCase().includes(searchQuery.toLowerCase()) || log.timestamp.includes(searchQuery);
        return matchesSearch;
    });
    const handleClearLogs = ()=>{
        setLogs([]);
        toast.success('Live log buffer cleared');
    };
    const handleDownloadLogs = ()=>{
        const content = logs.map((l)=>`[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`).join('\n');
        const blob = new Blob([
            content
        ], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thechronicle-logs-${new Date().toISOString().slice(0, 10)}.log`;
        a.click();
        toast.success('Raw log file downloaded');
    };
    return <div className='space-y-6'>
      { /* Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>System & Server Diagnostics</h1>
          <p className='text-muted-foreground text-sm'>
            Live telemetry stream for Next.js App Router, database queries, and background tasks.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={fetchLogs} className='gap-1.5 text-xs font-medium'>
            <RefreshCw className='size-3.5'/>
            Refresh
          </Button>
          <Button variant='outline' size='sm' onClick={handleClearLogs} className='gap-1.5 text-xs font-medium'>
            <Trash2 className='size-3.5'/>
            Clear Buffer
          </Button>
          <Button size='sm' onClick={handleDownloadLogs} className='gap-1.5 text-xs font-medium'>
            <Download className='size-3.5'/>
            Export Logs
          </Button>
        </div>
      </div>

      { /* Filter Ribbon */ }
      <Card className='border'>
        <CardContent className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative w-64'>
              <Search className='text-muted-foreground absolute top-2.5 left-2.5 size-3.5'/>
              <Input placeholder='Search raw console output...' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='font-mono text-xs pl-8'/>
            </div>

            <Select value={levelFilter} onValueChange={(v)=>{
        if (v) setLevelFilter(v);
    }}>
              <SelectTrigger className='w-[120px] font-mono text-xs font-medium'>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Levels</SelectItem>
                <SelectItem value='INFO'>INFO</SelectItem>
                <SelectItem value='WARN'>WARN</SelectItem>
                <SelectItem value='ERROR'>ERROR</SelectItem>
                <SelectItem value='DEBUG'>DEBUG</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={(v)=>{
        if (v) setServiceFilter(v);
    }}>
              <SelectTrigger className='w-[140px] font-mono text-xs font-medium'>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Services</SelectItem>
                <SelectItem value='next-server'>next-server</SelectItem>
                <SelectItem value='indexnow'>indexnow</SelectItem>
                <SelectItem value='prisma-orm'>prisma-orm</SelectItem>
                <SelectItem value='auth-nextauth'>auth-nextauth</SelectItem>
                <SelectItem value='core-api'>core-api</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-xs'>Auto-Tail</span>
              <Switch checked={autoScroll} onCheckedChange={setAutoScroll}/>
            </div>
            <Badge variant='outline' className='font-mono text-xs'>
              <Radio className='mr-1 size-2.5 animate-pulse text-foreground'/> {filteredLogs.length} entries
            </Badge>
          </div>
        </CardContent>
      </Card>

      { /* Terminal Viewport */ }
      <Card className='border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner'>
        <CardHeader className='flex flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-zinc-400'>
          <div className='flex items-center gap-2'>
            <Terminal className='size-4'/>
            <span className='text-xs font-semibold tracking-wide'>thechronicle-worker.log</span>
          </div>
          <div className='flex items-center gap-1.5 text-[11px]'>
            <span className='size-2 rounded-full bg-zinc-400'/>
            <span>Process ID: 3948 (Active)</span>
          </div>
        </CardHeader>
        <CardContent className='max-h-[520px] space-y-2 overflow-y-auto p-4'>
          {loading ? <div className='flex h-36 items-center justify-center font-mono text-xs text-zinc-500'>
              <Loader2 className='mr-2 size-4 animate-spin text-zinc-400'/> Loading telemetry stream...
            </div> : filteredLogs.length === 0 ? <div className='py-12 text-center font-mono text-xs text-zinc-500'>
              No matching log messages in current buffer.
            </div> : filteredLogs.map((log)=><div key={log.id} className='hover:bg-zinc-900 flex items-start gap-2 rounded px-2 py-1.5 transition-colors'>
                <span className='shrink-0 font-mono text-[11px] text-zinc-500'>
                  {log.timestamp.slice(11, 23)}
                </span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${log.level === 'ERROR' ? 'border border-zinc-700 bg-zinc-800 font-extrabold text-zinc-100' : log.level === 'WARN' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  {log.level}
                </span>
                <span className='shrink-0 font-mono text-[11px] text-zinc-400'>
                  [{log.service}]
                </span>
                <span className='break-all font-mono leading-relaxed text-zinc-200'>
                  {log.message}
                </span>
              </div>)}
        </CardContent>
      </Card>
    </div>;
}
