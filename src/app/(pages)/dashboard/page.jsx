'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FileText,
    FolderTree,
    Users,
    Image as ImageIcon,
    Plus,
    Sparkles,
    LayoutTemplate,
    CheckCircle2,
    Edit3,
    RefreshCw,
    Shield,
    Check,
    Clock,
    AlertCircle,
    Search,
    Bookmark,
    MessageSquare,
    Eye,
    TrendingUp,
    ExternalLink,
    Zap,
    Send,
    Flame,
    BarChart3,
    BookOpen,
    UserCog
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardOverviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSwitching, setIsSwitching] = useState(false);

    // Active Profile & Persona state
    const [profile, setProfile] = useState({
        id: '',
        name: 'Editorial Staff',
        email: '',
        role: 'SUPER_ADMIN'
    });
    const [availableUsers, setAvailableUsers] = useState([]);

    // Data state
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        articles: 0,
        categories: 0,
        users: 0,
        media: 0,
        comments: 0,
        published: 0,
        drafts: 0,
        breaking: 0,
        pendingReview: 0
    });

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileRes, articlesRes, catsRes, backupStatsRes] = await Promise.all([
                fetch('/api/profile'),
                fetch('/api/articles?limit=50'),
                fetch('/api/categories'),
                fetch('/api/backup/stats')
            ]);

            let activeProfile = null;
            if (profileRes.ok) {
                const pData = await profileRes.json();
                if (pData.success && pData.profile) {
                    activeProfile = pData.profile;
                    setProfile(pData.profile);
                }
                if (pData.availableUsers) {
                    setAvailableUsers(pData.availableUsers);
                }
            }

            let totalArticles = 0;
            let totalCats = 0;
            let totalUsers = 0;
            let totalMedia = 0;
            let totalComments = 0;

            if (backupStatsRes.ok) {
                const bData = await backupStatsRes.json();
                if (bData.success && bData.stats) {
                    totalArticles = bData.stats.articles || 0;
                    totalCats = bData.stats.categories || 0;
                    totalUsers = bData.stats.users || 0;
                    totalMedia = bData.stats.media || 0;
                    totalComments = bData.stats.comments || 0;
                }
            }

            let loadedArticles = [];
            if (articlesRes.ok) {
                const aData = await articlesRes.json();
                if (aData.success && aData.articles) {
                    loadedArticles = aData.articles;
                    setArticles(loadedArticles);

                    const published = loadedArticles.filter((a) => a.status === 'PUBLISHED').length;
                    const drafts = loadedArticles.filter((a) => a.status === 'DRAFT').length;
                    const pendingReview = loadedArticles.filter((a) => a.status === 'PENDING_REVIEW').length;
                    const breaking = loadedArticles.filter((a) => a.isBreaking).length;

                    setStats({
                        articles: totalArticles || aData.total || loadedArticles.length,
                        categories: totalCats,
                        users: totalUsers,
                        media: totalMedia,
                        comments: totalComments,
                        published,
                        drafts,
                        pendingReview,
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
        } catch {
            toast.error('Failed to load newsroom dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();

        const handlePersonaChanged = () => {
            loadDashboardData();
        };
        window.addEventListener('user-persona-changed', handlePersonaChanged);
        return () => window.removeEventListener('user-persona-changed', handlePersonaChanged);
    }, [loadDashboardData]);

    const handleSwitchPersona = async (targetUserId) => {
        if (!targetUserId || targetUserId === profile.id) return;
        try {
            setIsSwitching(true);
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'switch', userId: targetUserId })
            });
            const data = await res.json();
            if (data.success && data.profile) {
                toast.success(`Dashboard view switched to ${data.profile.name} (${data.profile.role})`);
                window.dispatchEvent(new CustomEvent('user-persona-changed', { detail: data.profile }));
                loadDashboardData();
            } else {
                toast.error(data.error || 'Failed to switch persona');
            }
        } catch {
            toast.error('Error switching persona');
        } finally {
            setIsSwitching(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge className="bg-foreground text-background font-mono text-[10px]">PUBLISHED</Badge>;
            case 'PENDING_REVIEW':
                return <Badge variant="secondary" className="font-mono text-[10px]">IN REVIEW</Badge>;
            case 'DRAFT':
                return <Badge variant="outline" className="font-mono text-[10px]">DRAFT</Badge>;
            default:
                return <Badge variant="outline" className="font-mono text-[10px]">{status}</Badge>;
        }
    };

    const currentRole = profile.role || 'SUPER_ADMIN';

    // Articles written by the active user (for author view)
    const myArticles = articles.filter((a) =>
        a.authorId === profile.id ||
        a.author?.id === profile.id ||
        a.author?.name?.toLowerCase() === profile.name?.toLowerCase()
    );

    // Articles pending review (for editor view)
    const pendingReviewArticles = articles.filter((a) => a.status === 'PENDING_REVIEW');

    return (
        <div className="space-y-6 pb-12">
            {/* Top Role Switcher & Persona Bar */}
            <div className="flex flex-col gap-3 p-3.5 rounded-lg border bg-muted/20 sm:flex-row sm:items-center sm:justify-between text-xs">
                <div className="flex items-center gap-2.5">
                    <Shield className="size-4 text-foreground shrink-0" />
                    <div>
                        <span className="text-muted-foreground">Active Role View:</span>{' '}
                        <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold mx-1">
                            {currentRole}
                        </Badge>
                        <span className="font-semibold text-foreground">{profile.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">Role Simulator:</span>
                    <div className="w-56">
                        <Select
                            value={profile.id}
                            onValueChange={handleSwitchPersona}
                            disabled={isSwitching}
                        >
                            <SelectTrigger className="h-7 text-xs font-medium">
                                <SelectValue placeholder="Switch Persona Role">
                                    {profile.name} ({currentRole})
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {availableUsers.map((u) => (
                                    <SelectItem key={u.id} value={u.id} className="text-xs">
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <span>{u.name}</span>
                                            <Badge variant="outline" className="font-mono text-[9px]">
                                                {u.role}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={loading} className="h-7 text-xs gap-1">
                        <RefreshCw className={`size-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Render Role-Specific Dashboard Views */}
            {['SUPER_ADMIN', 'ADMIN'].includes(currentRole) && (
                <ExecutiveAdminDashboard
                    stats={stats}
                    loading={loading}
                    articles={articles}
                    categories={categories}
                    getStatusBadge={getStatusBadge}
                    router={router}
                    loadDashboard={loadDashboardData}
                />
            )}

            {currentRole === 'EDITOR' && (
                <EditorInChiefDashboard
                    stats={stats}
                    loading={loading}
                    articles={articles}
                    pendingReviewArticles={pendingReviewArticles}
                    categories={categories}
                    getStatusBadge={getStatusBadge}
                    router={router}
                    loadDashboard={loadDashboardData}
                />
            )}

            {currentRole === 'AUTHOR' && (
                <AuthorReporterDashboard
                    profile={profile}
                    myArticles={myArticles}
                    loading={loading}
                    getStatusBadge={getStatusBadge}
                    router={router}
                    loadDashboard={loadDashboardData}
                />
            )}

            {currentRole === 'SEO_MANAGER' && (
                <SeoStrategistDashboard
                    articles={articles}
                    stats={stats}
                    loading={loading}
                    router={router}
                    loadDashboard={loadDashboardData}
                />
            )}

            {currentRole === 'READER' && (
                <ReaderSubscriberDashboard
                    profile={profile}
                    articles={articles}
                    categories={categories}
                    loading={loading}
                    router={router}
                />
            )}
        </div>
    );
}

/* =========================================================================
   1. SUPER_ADMIN & ADMIN: Executive Newsroom Desk
   ========================================================================= */
function ExecutiveAdminDashboard({ stats, loading, articles, categories, getStatusBadge, router, loadDashboard }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Executive Newsroom Desk</h1>
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                            FULL CONTROL
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Live wire status, real-time editorial dispatches, beat distribution, and publication operations.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => router.push('/dashboard/articles/new')} className="text-xs gap-1.5 font-medium">
                        <Plus className="size-3.5" /> Draft New Story
                    </Button>
                </div>
            </div>

            {/* 4 Core Newsroom Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Dispatches on Wire
                        </CardTitle>
                        <FileText className="size-4 text-foreground" />
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

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Editorial Desks & Beats
                        </CardTitle>
                        <FolderTree className="size-4 text-foreground" />
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

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Journalists & Staff
                        </CardTitle>
                        <Users className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : stats.users}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Accredited staff authors and editors
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Cloudinary Media
                        </CardTitle>
                        <ImageIcon className="size-4 text-foreground" />
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

            {/* Quick Action Navigation Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/articles/new" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Plus className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Write Article</div>
                        <div className="text-[11px] text-muted-foreground">Draft with rich WYSIWYG & photos</div>
                    </div>
                </Link>

                <Link href="/dashboard/media" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <ImageIcon className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Media Library</div>
                        <div className="text-[11px] text-muted-foreground">Upload & manage press assets</div>
                    </div>
                </Link>

                <Link href="/dashboard/homepage-builder" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <LayoutTemplate className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Homepage Builder</div>
                        <div className="text-[11px] text-muted-foreground">Broadsheet layout & lead stories</div>
                    </div>
                </Link>

                <Link href="/dashboard/seo" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Sparkles className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">SEO Command Center</div>
                        <div className="text-[11px] text-muted-foreground">SERP optimizer & sitemaps</div>
                    </div>
                </Link>
            </div>

            {/* Main Grid: Latest Wire Dispatches + Desks Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Latest Wire Dispatches</CardTitle>
                                <CardDescription className="text-xs">
                                    Recently published and drafted stories across all desks.
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => router.push('/dashboard/articles')}>
                                View All Wire
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="text-xs">
                                        <TableHead>Headline</TableHead>
                                        <TableHead>Desk</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                                                No articles loaded from database.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        articles.slice(0, 8).map((article) => (
                                            <TableRow key={article.id} className="text-xs">
                                                <TableCell className="font-medium max-w-[280px]">
                                                    <div className="flex items-center gap-1.5">
                                                        {article.isBreaking && (
                                                            <span className="font-mono text-[9px] uppercase px-1 py-0.5 bg-foreground text-background font-bold shrink-0">
                                                                FLASH
                                                            </span>
                                                        )}
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
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                                                        <Edit3 className="mr-1 size-3" /> Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Desks and System Health */}
                <div className="space-y-6">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-semibold">Active Reporting Desks</CardTitle>
                            <CardDescription className="text-xs">
                                Primary sections curated for publication.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors text-xs">
                                    <span className="font-medium">{cat.name}</span>
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                        {cat._count?.articles ?? 'Beat'}
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => router.push('/dashboard/categories')}>
                                Manage All Categories
                            </Button>
                        </CardContent>
                    </Card>

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
                                    <CheckCircle2 className="size-3" /> MongoDB Atlas
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Media Storage:</span>
                                <span className="font-semibold text-foreground flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Cloudinary CDN
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
        </div>
    );
}

/* =========================================================================
   2. EDITOR: Editorial Review & Publishing Queue Desk
   ========================================================================= */
function EditorInChiefDashboard({ stats, loading, articles, pendingReviewArticles, categories, getStatusBadge, router, loadDashboard }) {
    const [filterTab, setFilterTab] = useState('review');

    const displayArticles = filterTab === 'review'
        ? (pendingReviewArticles.length > 0 ? pendingReviewArticles : articles.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'DRAFT').slice(0, 8))
        : filterTab === 'breaking'
            ? articles.filter(a => a.isBreaking)
            : articles.slice(0, 8);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Editorial Pipeline & Desk</h1>
                        <Badge variant="secondary" className="font-mono text-xs uppercase">
                            EDITOR-IN-CHIEF
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Oversee reporter submissions, review dispatches for publication, curate the broadsheet layout, and broadcast flash bulletins.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => router.push('/dashboard/articles/new')} className="text-xs gap-1.5 font-medium">
                        <Plus className="size-3.5" /> Draft Lead Story
                    </Button>
                </div>
            </div>

            {/* 4 Editorial Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Pending Review Queue
                        </CardTitle>
                        <Clock className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : (pendingReviewArticles.length || stats.pendingReview || stats.drafts)}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Stories awaiting editorial sign-off
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Live Wire Dispatches
                        </CardTitle>
                        <FileText className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : stats.published}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Published news stories active on site
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Flash Bulletins
                        </CardTitle>
                        <Flame className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : stats.breaking}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Active breaking news ticker alerts
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Reader Comments
                        </CardTitle>
                        <MessageSquare className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : stats.comments}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Comments requiring moderation
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Editorial Actions */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/articles?status=PENDING_REVIEW" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Clock className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Review Pending Queue</div>
                        <div className="text-[11px] text-muted-foreground">Approve reporter submissions</div>
                    </div>
                </Link>

                <Link href="/dashboard/homepage-builder" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <LayoutTemplate className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Curate Broadsheet</div>
                        <div className="text-[11px] text-muted-foreground">Frontpage lead stories & grid</div>
                    </div>
                </Link>

                <Link href="/dashboard/comments" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <MessageSquare className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Moderate Comments</div>
                        <div className="text-[11px] text-muted-foreground">Review reader discussions</div>
                    </div>
                </Link>

                <Link href="/dashboard/photocard" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Sparkles className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Photocard Studio</div>
                        <div className="text-[11px] text-muted-foreground">Broadcast social quote cards</div>
                    </div>
                </Link>
            </div>

            {/* Editorial Publishing Pipeline */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Editorial Review Pipeline</CardTitle>
                                <CardDescription className="text-xs">
                                    Dispatches awaiting review or published to wire.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant={filterTab === 'review' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setFilterTab('review')}
                                >
                                    Pending & Drafts
                                </Button>
                                <Button
                                    variant={filterTab === 'breaking' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setFilterTab('breaking')}
                                >
                                    Flash Alerts
                                </Button>
                                <Button
                                    variant={filterTab === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setFilterTab('all')}
                                >
                                    All Stories
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="text-xs">
                                        <TableHead>Headline</TableHead>
                                        <TableHead>Beat Desk</TableHead>
                                        <TableHead>Reporter</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayArticles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                                                No stories matching this filter pipeline.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        displayArticles.map((article) => (
                                            <TableRow key={article.id} className="text-xs">
                                                <TableCell className="font-medium max-w-[260px]">
                                                    <div className="flex items-center gap-1.5">
                                                        {article.isBreaking && (
                                                            <span className="font-mono text-[9px] uppercase px-1 py-0.5 bg-foreground text-background font-bold shrink-0">
                                                                FLASH
                                                            </span>
                                                        )}
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
                                                    {article.author?.name || 'Staff Reporter'}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(article.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                                                        <Edit3 className="mr-1 size-3" /> Review
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Editorial Standards Checklist */}
                <div className="space-y-6">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-semibold">Editorial Standards & Fact-Check</CardTitle>
                            <CardDescription className="text-xs">
                                Mandatory newsroom guidelines prior to publishing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-3 text-xs">
                            <div className="flex items-start gap-2.5">
                                <span className="size-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</span>
                                <div>
                                    <span className="font-semibold text-foreground">Dual Source Verification:</span>
                                    <p className="text-muted-foreground text-[11px] mt-0.5">Confirm claims with at least two independent primary sources.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="size-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</span>
                                <div>
                                    <span className="font-semibold text-foreground">Photography Copyright:</span>
                                    <p className="text-muted-foreground text-[11px] mt-0.5">Ensure lead photography has licensed attribution or staff wire credit.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="size-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</span>
                                <div>
                                    <span className="font-semibold text-foreground">SEO & Meta Title:</span>
                                    <p className="text-muted-foreground text-[11px] mt-0.5">Check that focus keyword and meta description are populated.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-semibold">Active Reporting Desks</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-2">
                            {categories.map((c) => (
                                <div key={c.id} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted/30">
                                    <span className="font-medium">{c.name}</span>
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                        {c._count?.articles ?? 0} stories
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   3. AUTHOR: Reporter Profile & Personal Dispatch Desk
   ========================================================================= */
function AuthorReporterDashboard({ profile, myArticles, loading, getStatusBadge, router, loadDashboard }) {
    const publishedCount = myArticles.filter((a) => a.status === 'PUBLISHED').length;
    const draftCount = myArticles.filter((a) => a.status === 'DRAFT' || a.status === 'PENDING_REVIEW').length;
    const totalViews = myArticles.reduce((acc, a) => acc + (a.views || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Reporter Dispatch Desk</h1>
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                            JOURNALIST DESK
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Welcome back, <span className="font-semibold text-foreground">{profile.name}</span>. Track your published scoops, submit drafts to the editor, and create social photocards.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => router.push('/dashboard/articles/new')} className="text-xs gap-1.5 font-medium">
                        <Plus className="size-3.5" /> Draft New Story
                    </Button>
                </div>
            </div>

            {/* 4 Author Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            My Published Stories
                        </CardTitle>
                        <FileText className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : publishedCount}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Live on the public news wire
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            My In-Progress Drafts
                        </CardTitle>
                        <Clock className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : draftCount}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Drafts or stories awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            My Story Views
                        </CardTitle>
                        <Eye className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : totalViews.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Total cumulative article readers
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            My Profile Identity
                        </CardTitle>
                        <Users className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-lg font-bold truncate text-foreground">
                            {profile.name}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Accredited Staff Reporter
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Author Actions */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/articles/new" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Plus className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">File New Story</div>
                        <div className="text-[11px] text-muted-foreground">Write with rich WYSIWYG editor</div>
                    </div>
                </Link>

                <Link href="/dashboard/photocard" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Sparkles className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Generate Photocard</div>
                        <div className="text-[11px] text-muted-foreground">Create social media graphic quote</div>
                    </div>
                </Link>

                <Link href="/dashboard/media" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <ImageIcon className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Upload Press Photos</div>
                        <div className="text-[11px] text-muted-foreground">Media assets via Cloudinary</div>
                    </div>
                </Link>

                <Link href="/dashboard/profile" className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors group">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Edit3 className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold">Edit My Profile & Bio</div>
                        <div className="text-[11px] text-muted-foreground">Update avatar and author info</div>
                    </div>
                </Link>
            </div>

            {/* My Recent Dispatches */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">My Recent Dispatches</CardTitle>
                                <CardDescription className="text-xs">
                                    Articles authored by you and their current status on the news wire.
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => router.push('/dashboard/articles')}>
                                All My Articles
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="text-xs">
                                        <TableHead>Headline</TableHead>
                                        <TableHead>Desk</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myArticles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">
                                                You haven&apos;t filed any stories yet. Click &quot;Draft New Story&quot; above to begin!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        myArticles.slice(0, 8).map((article) => (
                                            <TableRow key={article.id} className="text-xs">
                                                <TableCell className="font-medium max-w-[280px]">
                                                    <div className="flex items-center gap-1.5">
                                                        {article.isBreaking && (
                                                            <span className="font-mono text-[9px] uppercase px-1 py-0.5 bg-foreground text-background font-bold shrink-0">
                                                                FLASH
                                                            </span>
                                                        )}
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
                                                <TableCell>{getStatusBadge(article.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                                                        <Edit3 className="mr-1 size-3" /> Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Writing Style Tips & Guidelines */}
                <div className="space-y-6">
                    <Card className="border">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-semibold">Newsroom Style & Ethics</CardTitle>
                            <CardDescription className="text-xs">
                                Field reporting principles for The Chronicle.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-3 text-xs leading-relaxed">
                            <div className="p-2.5 rounded border bg-muted/20 space-y-1">
                                <span className="font-bold text-foreground">Inverted Pyramid:</span>
                                <p className="text-muted-foreground text-[11px]">Deliver the core fact (Who, What, Where, When, Why) in the opening lead paragraph.</p>
                            </div>
                            <div className="p-2.5 rounded border bg-muted/20 space-y-1">
                                <span className="font-bold text-foreground">Attribution:</span>
                                <p className="text-muted-foreground text-[11px]">Always state source agency or spokesperson before direct quotes.</p>
                            </div>
                            <div className="p-2.5 rounded border bg-muted/20 space-y-1">
                                <span className="font-bold text-foreground">Featured Image:</span>
                                <p className="text-muted-foreground text-[11px]">Always attach a high-resolution 16:9 featured photo via the Media Picker.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   4. SEO_MANAGER: Newsroom SEO & Search Rankings Desk
   ========================================================================= */
function SeoStrategistDashboard({ articles, stats, loading, router, loadDashboard }) {
    const articlesWithSeo = articles.filter(a => a.metaTitle || a.metaDescription);
    const articlesNeedingSeo = articles.filter(a => !a.metaTitle || !a.metaDescription);
    const seoCoveragePercent = articles.length > 0 ? Math.round((articlesWithSeo.length / articles.length) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Search Engine Optimization (SEO) Desk</h1>
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                            SEO STRATEGY
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Audit article meta tags, Google SERP snippets, OpenGraph social cards, XML sitemaps, and search indexability.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => router.push('/dashboard/seo')} className="text-xs gap-1.5 font-medium">
                        <Sparkles className="size-3.5" /> Open SEO Command Desk
                    </Button>
                </div>
            </div>

            {/* 4 SEO Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            SEO Meta Coverage
                        </CardTitle>
                        <TrendingUp className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : `${seoCoveragePercent}%`}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Articles with customized meta tags
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Needs Meta Optimization
                        </CardTitle>
                        <AlertCircle className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : articlesNeedingSeo.length}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Stories lacking meta descriptions
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Active XML Sitemaps
                        </CardTitle>
                        <FileText className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            3
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Articles, Categories, Google News
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Indexability Score
                        </CardTitle>
                        <CheckCircle2 className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            94 / 100
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Crawlability & Schema audit rating
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main SEO Audit Table */}
            <Card className="border">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Wire Dispatches Metadata Audit</CardTitle>
                        <CardDescription className="text-xs">
                            Articles requiring meta tags, focus keywords, or OpenGraph images.
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => router.push('/dashboard/seo')}>
                        Full SEO Suite
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-xs">
                                <TableHead>Headline Title</TableHead>
                                <TableHead>Desk</TableHead>
                                <TableHead>Meta Title Status</TableHead>
                                <TableHead>Meta Description</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.slice(0, 10).map((article) => {
                                const hasMetaTitle = Boolean(article.metaTitle);
                                const hasMetaDesc = Boolean(article.metaDescription);

                                return (
                                    <TableRow key={article.id} className="text-xs">
                                        <TableCell className="font-medium max-w-[280px]">
                                            <span className="truncate block" title={article.title}>
                                                {article.title}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">
                                                {article.category?.name || 'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {hasMetaTitle ? (
                                                <Badge variant="secondary" className="font-mono text-[9px]">OPTIMIZED</Badge>
                                            ) : (
                                                <Badge variant="outline" className="font-mono text-[9px] text-muted-foreground">FALLBACK TITLE</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {hasMetaDesc ? (
                                                <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">
                                                    {article.metaDescription}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-muted-foreground italic">Missing description</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}
                                            >
                                                <Sparkles className="mr-1 size-3" /> Optimize
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

/* =========================================================================
   5. READER: Subscriber & Reader Reading Hub
   ========================================================================= */
function ReaderSubscriberDashboard({ profile, articles, categories, loading, router }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Subscriber & Reader Hub</h1>
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                            READER ACCESS
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Welcome to The Chronicle. Browse today&apos;s leading news investigations, follow reporting desks, and participate in community discussions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => router.push('/dashboard/profile')} className="text-xs gap-1.5 font-medium">
                        <Edit3 className="size-3.5" /> Reader Settings
                    </Button>
                </div>
            </div>

            {/* 4 Reader Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Reading Feed
                        </CardTitle>
                        <BookOpen className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : articles.length}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Dispatches on today&apos;s wire
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Followed Desks
                        </CardTitle>
                        <FolderTree className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {loading ? '...' : categories.length}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Active news beats and sections
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Membership Status
                        </CardTitle>
                        <CheckCircle2 className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-lg font-bold text-foreground">
                            Verified Reader
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Standard newsroom access
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Community Comments
                        </CardTitle>
                        <MessageSquare className="size-4 text-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-black font-mono tracking-tight text-foreground">
                            {profile._count?.comments ?? 0}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Discussions participated in
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Top Wire Feed */}
            <Card className="border">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-semibold">Today&apos;s Leading Wire Stories</CardTitle>
                    <CardDescription className="text-xs">
                        Curated dispatches from our global newsroom.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-xs">
                                <TableHead>Headline</TableHead>
                                <TableHead>Section Beat</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.slice(0, 8).map((article) => (
                                <TableRow key={article.id} className="text-xs">
                                    <TableCell className="font-medium max-w-[320px]">
                                        <div className="flex items-center gap-1.5">
                                            {article.isBreaking && (
                                                <span className="font-mono text-[9px] uppercase px-1 py-0.5 bg-foreground text-background font-bold shrink-0">
                                                    FLASH
                                                </span>
                                            )}
                                            <span className="truncate">{article.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px]">
                                            {article.category?.name || 'General'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {article.author?.name || 'The Chronicle Staff'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => router.push(`/dashboard/articles`)}
                                        >
                                            Read Story
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
