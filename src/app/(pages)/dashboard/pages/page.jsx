'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ExternalLinkIcon, Edit3Icon, Trash2Icon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
export default function StaticPagesListPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchPages = async ()=>{
        setLoading(true);
        try {
            const res = await fetch('/api/pages');
            const data = await res.json();
            if (data.success && Array.isArray(data.pages)) {
                setPages(data.pages);
            }
        } catch  {
            toast.error('Failed to load static pages');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchPages();
    }, []);
    const handleDelete = async (id, title)=>{
        if (!confirm(`Delete page "${title}"?`)) return;
        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Page deleted');
                setPages((prev)=>prev.filter((p1)=>p1.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete page');
            }
        } catch  {
            toast.error('Network error deleting page');
        }
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Static Institutional Pages</h1>
          <p className='text-muted-foreground text-sm'>
            Manage institutional, policy, and compliance pages on thechronicle.press ({pages.length} published).
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={fetchPages} className='gap-1.5 text-xs'>
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`}/>
            Refresh
          </Button>
          <Button size='sm' render={<Link href='/dashboard/pages/new'>
                <PlusIcon className='size-4'/> Create New Page
              </Link>} className='gap-2 text-xs font-medium'/>
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs'>Page Title</TableHead>
                <TableHead className='text-xs font-mono'>URL Slug</TableHead>
                <TableHead className='text-xs'>Placement</TableHead>
                <TableHead className='w-24 text-center text-xs'>Status</TableHead>
                <TableHead className='w-24 text-right text-xs'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && pages.length === 0 ? <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-xs text-muted-foreground'>
                    Loading pages from MongoDB...
                  </TableCell>
                </TableRow> : pages.length === 0 ? <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-xs text-muted-foreground'>
                    No static pages found.
                  </TableCell>
                </TableRow> : pages.map((page)=><TableRow key={page.id} className='hover:bg-muted/40'>
                    <TableCell>
                      <Link href={`/dashboard/pages/${page.id}/edit`} className='font-semibold text-sm hover:underline text-foreground'>
                        {page.title}
                      </Link>
                      {page.excerpt && <p className='text-xs text-muted-foreground line-clamp-1'>{page.excerpt}</p>}
                    </TableCell>
                    <TableCell className='font-mono text-muted-foreground text-xs'>
                      /{page.slug}
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground'>
                      {page.showInFooter ? 'Footer' : page.showInHeader ? 'Header' : 'Unlinked'}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant='outline' className={`text-[10px] font-mono ${page.status === 'PUBLISHED' ? 'border-foreground/40 bg-foreground/10 text-foreground' : 'text-muted-foreground'}`}>
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button variant='ghost' size='icon' className='size-7' render={<Link href={`/dashboard/pages/${page.id}/edit`}>
                              <Edit3Icon className='size-3.5'/>
                            </Link>}/>
                        <Button variant='ghost' size='icon' className='size-7' render={<a href={`https://thechronicle.press/${page.slug}`} target='_blank' rel='noreferrer'>
                              <ExternalLinkIcon className='size-3.5'/>
                            </a>}/>
                        <Button variant='ghost' size='icon' className='size-7 text-muted-foreground hover:text-foreground' onClick={()=>handleDelete(page.id, page.title)}>
                          <Trash2Icon className='size-3.5'/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
