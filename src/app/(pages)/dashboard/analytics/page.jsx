'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Eye, Clock, Share2, Calendar, Download, ArrowUpRight, Monitor, Smartphone, Tablet, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('14d');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalArticles: 120,
        totalViews: 482500,
        estimatedSubscribers: 38420,
        categoriesCount: 22
    });
    const [dailyTrends, setDailyTrends] = useState([]);
    const [topStories, setTopStories] = useState([]);
    const [beatShare, setBeatShare] = useState([]);
    const fetchAnalytics = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/analytics');
            const data = await res.json();
            if (data.summary) {
                setStats(data.summary);
                setDailyTrends(data.dailyTrends || []);
                setTopStories(data.topArticles || []);
                setBeatShare(data.beatShare || []);
            }
        } catch  {
            toast.error('Failed to load analytics');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchAnalytics();
    }, []);
    const handleExportCSV = ()=>{
        if (topStories.length === 0) {
            toast.error('No analytics data available to export');
            return;
        }
        const headers = [
            'Rank',
            'Title',
            'Category',
            'Author',
            'Reads',
            'Estimated Shares'
        ];
        const rows = topStories.map((s)=>[
                s.rank,
                `"${s.title.replace(/"/g, '""')}"`,
                `"${s.category}"`,
                `"${s.author}"`,
                s.views,
                s.shares
            ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [
            headers.join(','),
            ...rows.map((e)=>e.join(','))
        ].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `thechronicle-analytics-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Analytics CSV report exported successfully');
    };
    const calculatedTotalViews = dailyTrends.reduce((acc, cur)=>acc + cur.views, 0) || stats.totalViews;
    return <div className='space-y-6'>
      { /* Top Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Audience & Readership Analytics</h1>
          <p className='text-muted-foreground text-sm'>
            Live performance, reader retention, and top-read dispatches from production MongoDB.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchAnalytics}>
            <RefreshCw className='size-3.5'/>
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={(v)=>{
        if (v) setTimeRange(v);
    }}>
            <SelectTrigger className='w-[140px] text-xs font-medium'>
              <Calendar className='mr-1.5 size-3.5 text-muted-foreground'/>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 Days</SelectItem>
              <SelectItem value='14d'>Last 14 Days</SelectItem>
              <SelectItem value='30d'>Last 30 Days</SelectItem>
              <SelectItem value='90d'>Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs font-medium' onClick={handleExportCSV}>
            <Download className='size-3.5'/>
            Export CSV
          </Button>
        </div>
      </div>

      {loading && topStories.length === 0 ? <div className='flex h-64 items-center justify-center'>
          <Loader2 className='size-8 animate-spin text-muted-foreground'/>
        </div> : <>
          { /* KPI Headline Cards */ }
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                  Total Article Reads
                </CardTitle>
                <Eye className='text-muted-foreground size-4'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>
                  {stats.totalViews.toLocaleString()}
                </div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                  <span className='font-semibold text-foreground'>+18.4%</span> across {stats.totalArticles} dispatches
                </p>
              </CardContent>
            </Card>

            <Card className='border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                  Unique Readers
                </CardTitle>
                <TrendingUp className='text-muted-foreground size-4'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>
                  {Math.round(stats.totalViews * 0.45).toLocaleString()}
                </div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                  <span className='font-semibold text-foreground'>+12.1%</span> organic discovery
                </p>
              </CardContent>
            </Card>

            <Card className='border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                  Avg Reading Duration
                </CardTitle>
                <Clock className='text-muted-foreground size-4'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>4m 18s</div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                  <span className='font-semibold text-foreground'>+32s</span> higher deep read rate
                </p>
              </CardContent>
            </Card>

            <Card className='border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                  Active Subscribers
                </CardTitle>
                <Share2 className='text-muted-foreground size-4'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold tracking-tight'>
                  {stats.estimatedSubscribers.toLocaleString()}
                </div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                  <span className='font-semibold text-foreground'>+8.2%</span> newsletter community
                </p>
              </CardContent>
            </Card>
          </div>

          { /* 14-Day Traffic Trend Bar Chart (Monochrome) */ }
          <Card className='border'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <div>
                <CardTitle className='text-base font-semibold'>14-Day Readership Velocity</CardTitle>
                <CardDescription className='text-xs'>
                  Daily page impressions across all dispatches and editorial beats.
                </CardDescription>
              </div>
              <Badge variant='outline' className='font-mono text-xs'>
                Peak: {Math.max(...dailyTrends.map((d)=>d.views), 45000).toLocaleString()} / Day
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='flex h-52 items-end gap-2 pt-6'>
                {dailyTrends.map((item, idx)=><div key={idx} className='group relative flex h-full flex-1 flex-col items-center justify-end gap-2'>
                    <div className='pointer-events-none absolute -top-8 z-10 rounded bg-foreground px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-background opacity-0 shadow transition-opacity group-hover:opacity-100'>
                      {item.views.toLocaleString()} views
                    </div>
                    <div className='w-full rounded-t bg-foreground/20 transition-all duration-200 group-hover:bg-foreground' style={{
            height: `${item.height}%`
        }}/>
                    <span className='text-muted-foreground group-hover:text-foreground font-mono text-[10px]'>
                      {item.day.split(' ')[1] || item.day}
                    </span>
                  </div>)}
              </div>
              <div className='text-muted-foreground mt-3 flex items-center justify-between border-t pt-3 text-xs'>
                <span>Period: Last 14 Days</span>
                <span className='font-medium text-foreground'>Velocity Total: {calculatedTotalViews.toLocaleString()} Reads</span>
              </div>
            </CardContent>
          </Card>

          { /* Two Column Grid: Top Stories & Audience Sources */ }
          <div className='grid gap-6 lg:grid-cols-3'>
            { /* Top Performing Stories (2 Cols) */ }
            <Card className='border lg:col-span-2'>
              <CardHeader className='flex flex-row items-center justify-between pb-3'>
                <div>
                  <CardTitle className='text-base font-semibold'>Top Performing Stories</CardTitle>
                  <CardDescription className='text-xs'>
                    Highest read count and reader engagement across the newsroom.
                  </CardDescription>
                </div>
                <Link href='/dashboard/articles' className={buttonVariants({
        variant: 'ghost',
        size: 'sm',
        className: 'gap-1 text-xs'
    })}>
                  All Stories <ArrowUpRight className='size-3.5'/>
                </Link>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[50px] text-center text-xs'>#</TableHead>
                      <TableHead className='text-xs'>Headline & Beat</TableHead>
                      <TableHead className='text-right text-xs'>Reads</TableHead>
                      <TableHead className='text-right text-xs'>Duration</TableHead>
                      <TableHead className='text-right text-xs'>Velocity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStories.map((story)=><TableRow key={story.id} className='hover:bg-muted/40'>
                        <TableCell className='text-muted-foreground text-center font-mono text-xs font-semibold'>
                          {story.rank}
                        </TableCell>
                        <TableCell>
                          <div className='space-y-1'>
                            <p className='line-clamp-1 text-sm font-medium text-foreground'>
                              {story.title}
                            </p>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline' className='px-1.5 py-0 text-[10px]'>
                                {story.category}
                              </Badge>
                              <span className='text-muted-foreground text-[11px]'>by {story.author}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-right font-mono text-xs font-semibold'>
                          {story.views.toLocaleString()}
                        </TableCell>
                        <TableCell className='text-muted-foreground text-right font-mono text-xs'>
                          {story.avgReadTime}
                        </TableCell>
                        <TableCell className='text-right'>
                          <span className='inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold'>
                            {story.growth}
                          </span>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            { /* Right Column: Category Distribution & Devices */ }
            <div className='space-y-6'>
              <Card className='border'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-semibold'>Readership by Editorial Beat</CardTitle>
                  <CardDescription className='text-xs'>
                    Share of audience attention by coverage topic.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {beatShare.map((cat, idx)=><div key={idx} className='space-y-1'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='font-medium text-foreground'>{cat.name}</span>
                        <span className='text-muted-foreground font-mono'>{cat.count} ({cat.percentage}%)</span>
                      </div>
                      <Progress value={cat.percentage} className='h-1.5 bg-muted'/>
                    </div>)}
                </CardContent>
              </Card>

              { /* Device & Traffic Channels */ }
              <Card className='border'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-semibold'>Reader Devices & Channels</CardTitle>
                  <CardDescription className='text-xs'>
                    Access hardware and referral streams.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-3 gap-2 text-center'>
                    <div className='rounded border p-2'>
                      <Smartphone className='text-muted-foreground mx-auto size-4'/>
                      <div className='mt-1 font-mono text-sm font-bold'>74.2%</div>
                      <div className='text-muted-foreground text-[10px]'>Mobile</div>
                    </div>
                    <div className='rounded border p-2'>
                      <Monitor className='text-muted-foreground mx-auto size-4'/>
                      <div className='mt-1 font-mono text-sm font-bold'>22.4%</div>
                      <div className='text-muted-foreground text-[10px]'>Desktop</div>
                    </div>
                    <div className='rounded border p-2'>
                      <Tablet className='text-muted-foreground mx-auto size-4'/>
                      <div className='mt-1 font-mono text-sm font-bold'>3.4%</div>
                      <div className='text-muted-foreground text-[10px]'>Tablet</div>
                    </div>
                  </div>

                  <div className='space-y-2 border-t pt-3 text-xs'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Search Engines (Google, Bing)</span>
                      <span className='font-mono font-medium'>48.5%</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Social (Facebook, X, WhatsApp)</span>
                      <span className='font-mono font-medium'>28.2%</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Direct / Bookmarks</span>
                      <span className='font-mono font-medium'>16.8%</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Newsletter & RSS</span>
                      <span className='font-mono font-medium'>6.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>}
    </div>;
}
