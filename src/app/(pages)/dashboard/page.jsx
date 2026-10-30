'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileTextIcon, FolderTreeIcon, UsersIcon, ImageIcon, PlusIcon, SparklesIcon, LayoutTemplateIcon, CheckCircle2Icon, Edit3Icon, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export default function DashboardOverviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        articles: 0,
        categories: 0,
        users: 0,
        media: 0,
        published: 0,
        drafts: 0,
        breaking: 0
    });
    const loadDashboard = async ()=>{
        try {
            setLoading(true);
            const [articlesRes, catsRes, backupStatsRes] = await Promise.all([
                fetch('/api/articles?limit=10'),
                fetch('/api/categories'),
                fetch('/api/backup/stats')
            ]);
            let totalArticles = 0;
            let totalCats = 0;
            let totalUsers = 0;
            let totalMedia = 0;
            if (backupStatsRes.ok) {
                const bData = await backupStatsRes.json();
                if (bData.success && bData.stats) {
                    totalArticles = bData.stats.articles || 0;
                    totalCats = bData.stats.categories || 0;
                    totalUsers = bData.stats.users || 0;
                    totalMedia = bData.stats.media || 0;
                }
            }
            if (articlesRes.ok) {
                const aData = await articlesRes.json();
                if (aData.success && aData.articles) {
                    setArticles(aData.articles);
                    const published = aData.articles.filter((a)=>a.status === 'PUBLISHED').length;
                    const drafts = aData.articles.filter((a)=>a.status === 'DRAFT').length;
                    const breaking = aData.articles.filter((a)=>a.isBreaking).length;
                    setStats({
                        articles: totalArticles || aData.total || aData.articles.length,
                        categories: totalCats,
                        users: totalUsers,
                        media: totalMedia,
                        published,
                        drafts,
                        breaking
                    });
                }
            }
            if (catsRes.ok) {
                const cData = await catsRes.json();
                if (cData.categories) {
                    setCategories(cData.categories.slice(0, 6));
                }
            }
        } catch  {
            toast.error('Failed to load newsroom executive desk');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        loadDashboard();
    }, []);
    const getStatusBadge = (status)=>{
        switch(status){
            case 'PUBLISHED':
                return <Badge className="bg-foreground text-background font-mono text-[10px]">PUBLISHED</Badge>;
            case 'PENDING_REVIEW':
                return <Badge variant="secondary" className="font-mono text-[10px]">REVIEW</Badge>;
            case 'DRAFT':
                return <Badge variant="outline" className="font-mono text-[10px]">DRAFT</Badge>;
            default:
                return <Badge variant="outline" className="font-mono text-[10px]">{status}</Badge>;
        }
    };
    return <div className="space-y-6 pb-12">
      { /* Header */ }
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Executive Newsroom Desk</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              The Chronicle
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Live wire status, real-time editorial dispatches, beat distribution, and publication operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadDashboard} disabled={loading} className="text-xs gap-1.5">
            <RefreshCwIcon className={`size-3.5 ${loading ? 'animate-spin' : ''}`}/> Refresh
          </Button>

          <Button size="sm" onClick={()=>router.push('/dashboard/articles/new')} className="text-xs gap-1.5 font-medium">
            <PlusIcon className="size-3.5"/> Draft New Story
          </Button>
        </div>
      </div>

      { /* 4 Core Newsroom Metric Cards (Strictly No E-commerce / Fluff) */ }
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        { /* Total Articles */ }
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dispatches on Wire
            </CardTitle>
            <FileTextIcon className="size-4 text-foreground"/>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black font-mono tracking-tight text-foreground">
              {loading ? '...' : stats.articles}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Total editorial articles in MongoDB
            </p>
          </CardContent>
        </Card>

        { /* Editorial Categories */ }
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Editorial Desks & Beats
            </CardTitle>
            <FolderTreeIcon className="size-4 text-foreground"/>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black font-mono tracking-tight text-foreground">
              {loading ? '...' : stats.categories}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Active reporting beats and topics
            </p>
          </CardContent>
        </Card>

        { /* Accredited Journalists */ }
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Journalists & Staff
            </CardTitle>
            <UsersIcon className="size-4 text-foreground"/>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black font-mono tracking-tight text-foreground">
              {loading ? '...' : stats.users}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Accredited byline authors and editors
            </p>
          </CardContent>
        </Card>

        { /* Media Assets */ }
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cloudinary Media
            </CardTitle>
            <ImageIcon className="size-4 text-foreground"/>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black font-mono tracking-tight text-foreground">
              {loading ? '...' : stats.media}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Press photography and graphics
            </p>
          </CardContent>
        </Card>
      </div>

      { /* Quick Action Navigation Grid */ }
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/articles/new" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
            <PlusIcon className="size-4"/>
          </div>
          <div>
            <div className="text-xs font-semibold">Write Article</div>
            <div className="text-[11px] text-muted-foreground">Draft with rich markdown & photos</div>
          </div>
        </Link>

        <Link href="/dashboard/media" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
            <ImageIcon className="size-4"/>
          </div>
          <div>
            <div className="text-xs font-semibold">Media Library</div>
            <div className="text-[11px] text-muted-foreground">Upload & manage press assets</div>
          </div>
        </Link>

        <Link href="/dashboard/homepage-builder" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
            <LayoutTemplateIcon className="size-4"/>
          </div>
          <div>
            <div className="text-xs font-semibold">Homepage Builder</div>
            <div className="text-[11px] text-muted-foreground">Broadsheet layout & lead stories</div>
          </div>
        </Link>

        <Link href="/dashboard/photocard" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
            <SparklesIcon className="size-4"/>
          </div>
          <div>
            <div className="text-xs font-semibold">Photocard Studio</div>
            <div className="text-[11px] text-muted-foreground">Generate social graphic cards</div>
          </div>
        </Link>
      </div>

      { /* Main Grid: Latest Wire Dispatches + Desk Beats Overview */ }
      <div className="grid gap-6 lg:grid-cols-3">
        { /* Latest Wire Dispatches (2 cols) */ }
        <div className="space-y-4 lg:col-span-2">
          <Card className="border">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Latest Wire Dispatches</CardTitle>
                <CardDescription className="text-xs">
                  Recently published and drafted stories across all desks.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={()=>router.push('/dashboard/articles')}>
                View All Wire
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>Headline</TableHead>
                    <TableHead>Desk</TableHead>
                    <TableHead>Byline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                        No articles loaded from database.
                      </TableCell>
                    </TableRow> : articles.map((article)=><TableRow key={article.id} className="text-xs">
                        <TableCell className="font-medium max-w-[280px]">
                          <div className="flex items-center gap-1.5">
                            {article.isBreaking && <span className="font-mono text-[9px] uppercase px-1 py-0.2 bg-foreground text-background font-bold shrink-0">
                                FLASH
                              </span>}
                            <span className="truncate" title={article.title}>
                              {article.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {article.category?.name || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {article.author?.name || 'Editorial Staff'}
                        </TableCell>
                        <TableCell>{getStatusBadge(article.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={()=>router.push(`/dashboard/articles/${article.id}/edit`)}>
                            <Edit3Icon className="mr-1 size-3"/> Edit
                          </Button>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        { /* Right Column: Desks and Infrastructure Overview */ }
        <div className="space-y-6">
          { /* Active Desks */ }
          <Card className="border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold">Active Reporting Desks</CardTitle>
              <CardDescription className="text-xs">
                Primary sections curated for publication.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {categories.map((cat)=><div key={cat.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors text-xs">
                  <span className="font-medium">{cat.name}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {cat._count?.articles ?? 'Beat'}
                  </Badge>
                </div>)}
              <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={()=>router.push('/dashboard/categories')}>
                Manage All Categories
              </Button>
            </CardContent>
          </Card>

          { /* Quick System Integrity Status */ }
          <Card className="border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold">System & Newsroom Health</CardTitle>
              <CardDescription className="text-xs">
                Database synchronization and cloud storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <CheckCircle2Icon className="size-3"/> MongoDB Atlas
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Media Storage:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <CheckCircle2Icon className="size-3"/> Cloudinary CDN
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Theme Palette:</span>
                <span className="text-foreground">Pure OKLCH (Chroma 0)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Editorial Wire:</span>
                <span className="text-foreground">Active (Port 3000)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
