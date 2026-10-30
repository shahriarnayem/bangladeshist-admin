'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, BarChart2Icon, Trash2Icon, Loader2Icon, RefreshCwIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export default function ReaderPollsPage() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    // New poll form
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        '',
        ''
    ]);
    const fetchPolls = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/polls');
            const data = await res.json();
            if (data.success) {
                setPolls(data.polls || []);
            }
        } catch  {
            toast.error('Failed to load opinion polls');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchPolls();
    }, []);
    const handleAddOptionField = ()=>{
        if (options.length < 5) {
            setOptions([
                ...options,
                ''
            ]);
        }
    };
    const handleRemoveOptionField = (idx)=>{
        if (options.length > 2) {
            setOptions(options.filter((_, i)=>i !== idx));
        }
    };
    const handleOptionChange = (idx, val)=>{
        const next = [
            ...options
        ];
        next[idx] = val;
        setOptions(next);
    };
    const handleCreatePoll = async (e)=>{
        e.preventDefault();
        const cleanOpts = options.map((o)=>o.trim()).filter(Boolean);
        if (!question.trim()) {
            toast.error('Poll question is required');
            return;
        }
        if (cleanOpts.length < 2) {
            toast.error('At least 2 non-empty options are required');
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch('/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question.trim(),
                    options: cleanOpts
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Poll published successfully');
                setDialogOpen(false);
                setQuestion('');
                setOptions([
                    '',
                    ''
                ]);
                fetchPolls();
            } else {
                toast.error(data.error || 'Failed to create poll');
            }
        } catch  {
            toast.error('Network error creating poll');
        } finally{
            setSubmitting(false);
        }
    };
    const handleToggleActive = async (id, currentStatus)=>{
        try {
            const res = await fetch(`/api/polls/${id}`, {
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
                toast.success(currentStatus ? 'Poll closed to new votes' : 'Poll reopened');
                setPolls((prev)=>prev.map((p1)=>p1.id === id ? {
                            ...p1,
                            isActive: !currentStatus
                        } : p1));
            } else {
                toast.error(data.error || 'Failed to toggle poll status');
            }
        } catch  {
            toast.error('Network error updating poll');
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm('Are you sure you want to permanently delete this poll?')) return;
        try {
            const res = await fetch(`/api/polls/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Poll deleted successfully');
                setPolls((prev)=>prev.filter((p1)=>p1.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete poll');
            }
        } catch  {
            toast.error('Network error deleting poll');
        }
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Reader Opinion Polls</h1>
          <p className='text-muted-foreground text-sm'>
            Create, monitor, and embed public opinion sentiment polls in The Chronicle stories.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5' onClick={fetchPolls}>
            <RefreshCwIcon className='size-3.5'/> Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button className='gap-2'/>}>
              <PlusIcon className='size-4'/> Create New Poll
            </DialogTrigger>
            <DialogContent className='sm:max-w-[480px]'>
              <form onSubmit={handleCreatePoll}>
                <DialogHeader>
                  <DialogTitle>New Editorial Poll</DialogTitle>
                  <DialogDescription>Draft a reader question with selectable answer options.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='poll-q'>Poll Question *</Label>
                    <Input id='poll-q' placeholder='e.g. Should export logistics subsidies be renewed for FY2027?' value={question} onChange={(e)=>setQuestion(e.target.value)} required/>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label>Options (Min 2, Max 5)</Label>
                      {options.length < 5 && <Button type='button' variant='ghost' size='sm' className='h-7 text-xs' onClick={handleAddOptionField}>
                          + Add Option
                        </Button>}
                    </div>
                    {options.map((opt, idx)=><div key={idx} className='flex items-center gap-2'>
                        <Input placeholder={`Option ${idx + 1}`} value={opt} onChange={(e)=>handleOptionChange(idx, e.target.value)} required/>
                        {options.length > 2 && <Button type='button' variant='ghost' size='icon' className='size-8 shrink-0 text-muted-foreground hover:text-destructive' onClick={()=>handleRemoveOptionField(idx)}>
                            <XIcon className='size-3.5'/>
                          </Button>}
                      </div>)}
                  </div>
                </div>
                <DialogFooter>
                  <Button type='button' variant='outline' onClick={()=>setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={submitting}>
                    {submitting && <Loader2Icon className='mr-2 size-4 animate-spin'/>}
                    Publish Poll
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? <div className='flex h-48 items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-muted-foreground'/>
        </div> : polls.length === 0 ? <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <BarChart2Icon className='text-muted-foreground mb-3 size-10'/>
            <p className='text-muted-foreground text-sm'>No opinion polls found in database.</p>
            <Button variant='outline' size='sm' className='mt-3 gap-1.5' onClick={()=>setDialogOpen(true)}>
              <PlusIcon className='size-3.5'/> Create Your First Poll
            </Button>
          </CardContent>
        </Card> : <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {polls.map((poll)=><Card key={poll.id} className='flex flex-col justify-between'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between gap-2'>
                  <CardTitle className='text-base font-semibold leading-snug'>{poll.question}</CardTitle>
                  <Badge variant='outline' className={poll.isActive ? 'border-foreground font-mono font-medium' : 'text-muted-foreground font-mono'}>
                    {poll.isActive ? 'Active' : 'Closed'}
                  </Badge>
                </div>
                <CardDescription className='text-xs'>
                  Created {new Date(poll.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })} • {poll.totalVotes.toLocaleString()} votes cast
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3 pt-2'>
                {poll.options.map((optText, idx)=>{
            const votes = poll.votes?.[optText] || 0;
            const pct = poll.totalVotes > 0 ? Math.round(votes / poll.totalVotes * 100) : 0;
            return <div key={idx} className='space-y-1.5'>
                      <div className='flex justify-between text-xs'>
                        <span className='font-medium'>{optText}</span>
                        <span className='text-muted-foreground font-mono'>
                          {votes} ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} className='h-2 bg-muted'/>
                    </div>;
        })}
              </CardContent>
              <div className='flex items-center justify-between border-t px-6 py-3'>
                <Button variant='ghost' size='sm' className='h-8 text-xs' onClick={()=>handleToggleActive(poll.id, poll.isActive)}>
                  {poll.isActive ? 'Close Poll' : 'Reopen Poll'}
                </Button>
                <Button variant='ghost' size='icon' className='size-8 text-destructive' onClick={()=>handleDelete(poll.id)}>
                  <Trash2Icon className='size-3.5'/>
                </Button>
              </div>
            </Card>)}
        </div>}
    </div>;
}
