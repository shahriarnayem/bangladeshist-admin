'use client';
import { useState, useEffect } from 'react';
import { TagIcon, PlusIcon, SearchIcon, Trash2Icon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTag, setNewTag] = useState('');
    const [search, setSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchTags = async (query = '')=>{
        setLoading(true);
        try {
            const url = query ? `/api/tags?search=${encodeURIComponent(query)}` : '/api/tags';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success && Array.isArray(data.tags)) {
                setTags(data.tags);
            }
        } catch  {
            toast.error('Failed to load tags from MongoDB');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchTags();
    }, []);
    const handleAddTag = async (e)=>{
        e.preventDefault();
        if (!newTag.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newTag.trim()
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Tag "${data.tag.name}" created`);
                setNewTag('');
                fetchTags();
            } else {
                toast.error(data.error || 'Failed to create tag');
            }
        } catch  {
            toast.error('Network error creating tag');
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id, name)=>{
        if (!confirm(`Delete tag "${name}"?`)) return;
        try {
            const res = await fetch(`/api/tags/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Tag removed');
                setTags((prev)=>prev.filter((t)=>t.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete tag');
            }
        } catch  {
            toast.error('Network error deleting tag');
        }
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Tags & Topic Index</h1>
          <p className='text-muted-foreground text-sm'>
            Live MongoDB topics ({tags.length} tags indexed across dispatches).
          </p>
        </div>
        <Button variant='outline' size='sm' onClick={()=>fetchTags(search)} className='gap-1.5 text-xs font-medium'>
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`}/>
          Refresh
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        { /* Quick Add Card */ }
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <TagIcon className='size-4'/> Add New Topic Tag
            </CardTitle>
            <CardDescription className='text-xs'>
              Tags will automatically become clickable search chips on article pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTag} className='space-y-3'>
              <Input placeholder='e.g. Central Bank, IMF Loan...' value={newTag} onChange={(e)=>setNewTag(e.target.value)} className='text-xs'/>
              <Button type='submit' size='sm' disabled={isSubmitting} className='w-full text-xs font-medium'>
                <PlusIcon className='mr-1.5 size-3.5'/> {isSubmitting ? 'Adding...' : 'Create Topic Tag'}
              </Button>
            </form>
          </CardContent>
        </Card>

        { /* Tags Table */ }
        <div className='space-y-4 lg:col-span-2'>
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <div className='relative w-full max-w-sm'>
                  <SearchIcon className='text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2'/>
                  <Input placeholder='Filter tags...' value={search} onChange={(e)=>{
        setSearch(e.target.value);
        fetchTags(e.target.value);
    }} className='pl-8 text-xs'/>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-xs'>Tag Name</TableHead>
                    <TableHead className='text-xs font-mono'>Slug</TableHead>
                    <TableHead className='text-right text-xs'>Stories</TableHead>
                    <TableHead className='w-12 text-right'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && tags.length === 0 ? <TableRow>
                      <TableCell colSpan={4} className='h-32 text-center text-xs text-muted-foreground'>
                        Loading tags from MongoDB...
                      </TableCell>
                    </TableRow> : tags.length === 0 ? <TableRow>
                      <TableCell colSpan={4} className='h-32 text-center text-xs text-muted-foreground'>
                        No topic tags found.
                      </TableCell>
                    </TableRow> : tags.map((tag)=><TableRow key={tag.id} className='hover:bg-muted/40'>
                        <TableCell className='font-semibold text-xs text-foreground'>
                          {tag.name}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>
                          #{tag.slug}
                        </TableCell>
                        <TableCell className='text-right font-mono text-xs'>
                          {tag._count?.articles ?? 0}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='icon' className='size-7 text-muted-foreground hover:text-foreground' onClick={()=>handleDelete(tag.id, tag.name)}>
                            <Trash2Icon className='size-3.5'/>
                          </Button>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
