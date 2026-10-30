'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FilePlus2Icon, SearchIcon, ExternalLinkIcon, MoreHorizontalIcon, Edit3Icon, Trash2Icon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const fetchArticles = async ()=>{
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            const res = await fetch(`/api/articles?${params.toString()}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.articles)) {
                setArticles(data.articles);
            }
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchArticles();
    }, [
        statusFilter
    ]);
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        fetchArticles();
    };
    const handleDelete = async (id, title)=>{
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Article deleted');
                setArticles((prev)=>prev.filter((a1)=>a1.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete article');
            }
        } catch  {
            toast.error('Network error deleting article');
        }
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Articles & Stories</h1>
          <p className='text-muted-foreground text-sm'>
            Live database records from The Chronicle newsroom ({articles.length} dispatches loaded).
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={fetchArticles} className='gap-1.5 text-xs'>
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`}/>
            Refresh
          </Button>
          <Button render={<Link href='/dashboard/articles/new'>
                <FilePlus2Icon className='size-4'/> Write New Article
              </Link>} className='gap-2 text-xs font-medium'/>
        </div>
      </div>

      <Card>
        <CardHeader className='pb-4'>
          <form onSubmit={handleSearchSubmit} className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='relative w-full sm:w-80'>
              <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2'/>
              <Input placeholder='Search articles...' value={search} onChange={(e)=>setSearch(e.target.value)} className='pl-9 text-xs'/>
            </div>
            <div className='flex items-center gap-2'>
              <Select value={statusFilter} onValueChange={(v)=>{
        if (v) setStatusFilter(v);
    }}>
                <SelectTrigger className='w-[140px] text-xs font-medium'>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>All Statuses</SelectItem>
                  <SelectItem value='PUBLISHED'>Published</SelectItem>
                  <SelectItem value='DRAFT'>Draft</SelectItem>
                  <SelectItem value='PENDING_REVIEW'>In Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[420px] text-xs'>Headline & Slug</TableHead>
                <TableHead className='text-xs'>Beat</TableHead>
                <TableHead className='text-xs'>Byline Author</TableHead>
                <TableHead className='text-right text-xs'>Views</TableHead>
                <TableHead className='w-[100px] text-center text-xs'>Status</TableHead>
                <TableHead className='text-right text-xs'>Published</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && articles.length === 0 ? <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-xs text-muted-foreground'>
                    Loading dispatches from MongoDB...
                  </TableCell>
                </TableRow> : articles.length === 0 ? <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-xs text-muted-foreground'>
                    No articles found matching query.
                  </TableCell>
                </TableRow> : articles.map((article)=><TableRow key={article.id} className='hover:bg-muted/40'>
                    <TableCell>
                      <div className='space-y-1'>
                        <Link href={`/dashboard/articles/${article.id}/edit`} className='font-semibold text-sm hover:underline line-clamp-1 text-foreground'>
                          {article.title}
                        </Link>
                        <div className='flex items-center gap-2'>
                          <p className='font-mono text-xs text-muted-foreground line-clamp-1'>
                            /articles/{article.slug}
                          </p>
                          {article.metaTitle || article.keywords ? (
                            <Badge variant='outline' className='text-[9px] h-4 px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono shrink-0'>
                              SEO 85+
                            </Badge>
                          ) : (
                            <Badge variant='outline' className='text-[9px] h-4 px-1.5 py-0 border-amber-500/40 text-amber-600 dark:text-amber-400 font-mono shrink-0'>
                              SEO NEEDED
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-[10px] font-mono'>
                        {article.category?.parent?.name ? `${article.category.parent.name} → ${article.category.name}` : (article.category?.name || 'General')}
                      </Badge>
                      {article.source && (
                        <div className='text-[10px] text-muted-foreground mt-0.5 font-mono line-clamp-1'>
                          {article.source}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='text-xs font-medium'>{article.author?.name || 'Staff Author'}</div>
                      <div className='text-muted-foreground text-[10px] uppercase font-mono'>{article.author?.role || 'EDITORIAL'}</div>
                    </TableCell>
                    <TableCell className='text-right font-mono text-xs font-semibold'>
                      {(article.views || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant='outline' className={`text-[10px] font-mono uppercase ${article.status === 'PUBLISHED' ? 'border-foreground/40 bg-foreground/10 text-foreground' : 'text-muted-foreground'}`}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right font-mono text-xs text-muted-foreground'>
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant='ghost' size='icon' className='size-7'/>}>
                          <MoreHorizontalIcon className='size-3.5'/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem render={<Link href={`/dashboard/articles/${article.id}/edit`}>
                                <Edit3Icon className='mr-2 size-3.5'/> Edit Story
                              </Link>}/>
                          <DropdownMenuItem render={<a href={`https://thechronicle.press/articles/${article.slug}`} target='_blank' rel='noreferrer'>
                                <ExternalLinkIcon className='mr-2 size-3.5'/> Public URL
                              </a>}/>
                          <DropdownMenuItem className='text-destructive' onClick={()=>handleDelete(article.id, article.title)}>
                            <Trash2Icon className='mr-2 size-3.5'/> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
