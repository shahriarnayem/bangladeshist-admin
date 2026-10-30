'use client';
import { useState, useEffect } from 'react';
import { MessageSquareIcon, CheckIcon, AlertTriangleIcon, Trash2Icon, SearchIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
export default function CommentsModerationPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const fetchComments = async ()=>{
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (activeTab !== 'all') params.set('status', activeTab);
            const res = await fetch(`/api/comments?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setComments(data.comments || []);
            }
        } catch  {
            toast.error('Failed to load comments');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchComments();
    }, [
        activeTab
    ]);
    const handleUpdateStatus = async (id, isApproved, isReported)=>{
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isApproved,
                    isReported
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(isApproved ? 'Comment approved' : isReported ? 'Comment flagged as spam' : 'Comment status updated');
                setComments((prev)=>prev.map((c)=>c.id === id ? {
                            ...c,
                            isApproved,
                            isReported
                        } : c));
            } else {
                toast.error(data.error || 'Failed to update comment status');
            }
        } catch  {
            toast.error('Network error updating comment');
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm('Are you sure you want to permanently delete this comment?')) return;
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Comment deleted successfully');
                setComments((prev)=>prev.filter((c)=>c.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete comment');
            }
        } catch  {
            toast.error('Network error deleting comment');
        }
    };
    const filteredComments = comments.filter((c)=>{
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const author = (c.user?.name || c.guestName || '').toLowerCase();
        const text = (c.content || '').toLowerCase();
        const article = (c.article?.title || '').toLowerCase();
        return author.includes(q) || text.includes(q) || article.includes(q);
    });
    const counts = {
        all: comments.length,
        pending: comments.filter((c)=>!c.isApproved && !c.isReported).length,
        approved: comments.filter((c)=>c.isApproved).length,
        spam: comments.filter((c)=>c.isReported).length
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Comments Moderation</h1>
          <p className='text-muted-foreground text-sm'>
            Review, approve, or flag reader feedback across The Chronicle articles.
          </p>
        </div>
        <Button variant='outline' size='sm' className='gap-1.5' onClick={fetchComments}>
          <RefreshCwIcon className='size-3.5'/> Refresh
        </Button>
      </div>

      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <TabsList>
            <TabsTrigger value='all'>All ({counts.all})</TabsTrigger>
            <TabsTrigger value='pending'>Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value='approved'>Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value='spam'>Flagged ({counts.spam})</TabsTrigger>
          </TabsList>

          <div className='relative w-full sm:w-72'>
            <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2'/>
            <Input placeholder='Search comments or authors...' className='pl-9' value={search} onChange={(e)=>setSearch(e.target.value)}/>
          </div>
        </div>

        <Card className='mt-6 overflow-hidden'>
          {loading ? <div className='flex h-48 items-center justify-center'>
              <Loader2Icon className='size-8 animate-spin text-muted-foreground'/>
            </div> : filteredComments.length === 0 ? <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <MessageSquareIcon className='text-muted-foreground mb-3 size-10'/>
              <p className='text-muted-foreground text-sm'>No comments found matching current filter.</p>
            </CardContent> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[220px]'>Reader / Author</TableHead>
                  <TableHead>Comment & Article Context</TableHead>
                  <TableHead className='w-[120px]'>Status</TableHead>
                  <TableHead className='w-[140px] text-right'>Moderation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment)=>{
        const authorName = comment.user?.name || comment.guestName || 'Reader';
        const initials = authorName.split(' ').map((n)=>n[0]).join('').slice(0, 2).toUpperCase();
        const statusLabel = comment.isReported ? 'Flagged' : comment.isApproved ? 'Approved' : 'Pending';
        return <TableRow key={comment.id}>
                      <TableCell className='align-top'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='size-9 border'>
                            <AvatarFallback className='text-xs font-semibold'>{initials}</AvatarFallback>
                          </Avatar>
                          <div className='min-w-0'>
                            <div className='truncate font-medium'>{authorName}</div>
                            <div className='truncate text-xs text-muted-foreground'>
                              {comment.user?.email || 'Guest Reader'}
                            </div>
                            <div className='text-[10px] text-muted-foreground'>
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='align-top'>
                        <div className='space-y-1'>
                          <p className='text-sm leading-relaxed'>{comment.content}</p>
                          {comment.article && <div className='text-xs text-muted-foreground'>
                              Article:{' '}
                              <span className='font-medium text-foreground underline decoration-muted-foreground/30'>
                                {comment.article.title}
                              </span>
                            </div>}
                        </div>
                      </TableCell>
                      <TableCell className='align-top'>
                        <Badge variant='outline' className={statusLabel === 'Approved' ? 'border-foreground font-mono font-medium' : statusLabel === 'Flagged' ? 'border-destructive text-destructive font-mono font-medium' : 'text-muted-foreground font-mono'}>
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className='align-top text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {!comment.isApproved && <Button variant='ghost' size='icon' className='size-8' title='Approve' onClick={()=>handleUpdateStatus(comment.id, true, false)}>
                              <CheckIcon className='size-4'/>
                            </Button>}
                          {!comment.isReported && <Button variant='ghost' size='icon' className='size-8' title='Flag as Spam' onClick={()=>handleUpdateStatus(comment.id, false, true)}>
                              <AlertTriangleIcon className='size-4'/>
                            </Button>}
                          <Button variant='ghost' size='icon' className='size-8 text-destructive' title='Delete' onClick={()=>handleDelete(comment.id)}>
                            <Trash2Icon className='size-4'/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>;
    })}
              </TableBody>
            </Table>}
        </Card>
      </Tabs>
    </div>;
}
