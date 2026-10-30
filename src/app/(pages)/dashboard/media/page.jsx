'use client';
import { useState, useEffect } from 'react';
import { UploadCloudIcon, SearchIcon, CopyIcon, Trash2Icon, CheckIcon, Loader2Icon, UserIcon, ShieldIcon, ExternalLinkIcon, FolderOpenIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function MediaLibraryPage() {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    // Active User / Permissions
    const [activeUser, setActiveUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [filterUploader, setFilterUploader] = useState('all');
    // Upload modal & direct file upload
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    // Load users once for identity selector
    useEffect(()=>{
        async function fetchUsers() {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    if (data.users) setAvailableUsers(data.users);
                }
            } catch  {
            // Fallback
            }
        }
        fetchUsers();
    }, []);
    // Fetch Media
    const fetchMedia = async ()=>{
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search.trim()) params.set('search', search.trim());
            if (typeFilter !== 'all') params.set('type', typeFilter);
            if (selectedUserId) params.set('userId', selectedUserId);
            if (filterUploader && filterUploader !== 'all') params.set('uploaderId', filterUploader);
            const res = await fetch(`/api/media?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setMediaList(data.media || []);
                setActiveUser(data.currentUser);
                setIsAdmin(Boolean(data.isAdmin));
                if (!selectedUserId && data.currentUser) {
                    setSelectedUserId(data.currentUser.id);
                }
            }
        } catch  {
            toast.error('Failed to load media assets');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        const timer = setTimeout(()=>{
            fetchMedia();
        }, 250);
        return ()=>clearTimeout(timer);
    }, [
        search,
        typeFilter,
        selectedUserId,
        filterUploader
    ]);
    const handleCopyUrl = (id, url)=>{
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success('Media URL copied to clipboard');
        setTimeout(()=>setCopiedId(null), 2000);
    };
    const handleDelete = async (id)=>{
        if (!confirm('Are you sure you want to permanently delete this media asset?')) return;
        try {
            const res = await fetch(`/api/media/${id}${selectedUserId ? `?userId=${selectedUserId}` : ''}`, {
                method: 'DELETE',
                headers: selectedUserId ? {
                    'x-user-id': selectedUserId
                } : {}
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Media asset deleted');
                setMediaList((prev)=>prev.filter((m)=>m.id !== id));
            } else {
                toast.error(data.error || 'Failed to delete asset');
            }
        } catch  {
            toast.error('Network error deleting media');
        }
    };
    // Direct file upload to Cloudinary with uploader attribution
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingFile(true);
            const fd = new FormData();
            fd.append('file', file);
            if (selectedUserId) fd.append('userId', selectedUserId);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: selectedUserId ? {
                    'x-user-id': selectedUserId
                } : {},
                body: fd
            });
            const data = await res.json();
            if (data.success && data.url) {
                toast.success(`Photo uploaded to Cloudinary as ${activeUser?.name || 'User'}`);
                setDialogOpen(false);
                fetchMedia();
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch  {
            toast.error('Network error uploading asset');
        } finally{
            setIsUploadingFile(false);
            e.target.value = '';
        }
    };
    const formatSize = (bytes)=>{
        if (!bytes) return '240 KB';
        if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${Math.round(bytes / 1024)} KB`;
    };
    return <div className='space-y-6 pb-12'>
      { /* Top Header */ }
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div>
          <div className="flex items-center gap-2">
            <h1 className='text-2xl font-bold tracking-tight'>Media & Press Photography Library</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              Cloudinary Asset Hub
            </Badge>
          </div>
          <p className='text-muted-foreground text-sm'>
            High-resolution photography, editorial graphics, and visual media assets with role-based permissions.
          </p>
        </div>

        { /* User Identity Switcher (Admin / Author Role Testing) */ }
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-lg border text-xs">
            <span className="text-muted-foreground font-medium pl-1 hidden sm:inline">Active User:</span>
            <Select value={selectedUserId} onValueChange={(val)=>{
        if (val) setSelectedUserId(val);
    }}>
              <SelectTrigger className="text-xs h-7 w-[200px] font-medium bg-background">
                <SelectValue placeholder="Switch User Identity"/>
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((u)=><SelectItem key={u.id} value={u.id} className="text-xs">
                    {u.name} ({u.role})
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <label className="cursor-pointer">
            <span className={buttonVariants({
        size: 'sm',
        className: 'gap-1.5 text-xs font-medium'
    })}>
              {isUploadingFile ? <Loader2Icon className="size-3.5 animate-spin"/> : <UploadCloudIcon className="size-3.5"/>}
              Upload Asset
            </span>
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploadingFile} className="hidden"/>
          </label>
        </div>
      </div>

      { /* Role Visibility Information Ribbon */ }
      <Card className="border bg-muted/20">
        <CardContent className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {isAdmin ? <div className="size-7 rounded-full bg-foreground text-background flex items-center justify-center">
                <ShieldIcon className="size-4"/>
              </div> : <div className="size-7 rounded-full bg-muted flex items-center justify-center text-foreground">
                <UserIcon className="size-4"/>
              </div>}
            <div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <span>{isAdmin ? 'Administrator Access Mode' : 'Author / Reporter Access Mode'}</span>
                <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-[10px] font-mono">
                  {activeUser?.role || 'USER'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px]">
                {isAdmin ? 'Only administrators can view all uploaded assets across all newsroom authors.' : 'Role isolation active — you can only see and manage assets uploaded by your account.'}
              </p>
            </div>
          </div>

          { /* Admin Uploader Filter */ }
          {isAdmin && <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-muted-foreground">Filter by Uploader:</span>
              <Select value={filterUploader} onValueChange={(val)=>{
        if (val) setFilterUploader(val);
    }}>
                <SelectTrigger className="text-xs h-7 w-[160px] bg-background">
                  <SelectValue placeholder="All Uploaders"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Uploaders</SelectItem>
                  {availableUsers.map((u)=><SelectItem key={u.id} value={u.id} className="text-xs">
                      {u.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>}
        </CardContent>
      </Card>

      { /* Drag & Drop Upload Zone */ }
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center p-8 text-center'>
          <UploadCloudIcon className='text-muted-foreground mb-3 size-10'/>
          <h3 className='text-base font-semibold'>Upload press photography or media files</h3>
          <p className='text-muted-foreground mt-1 text-xs'>
            Files are hosted on Cloudinary and registered with ownership attribution to{' '}
            <strong className="text-foreground">{activeUser?.name || 'Current User'}</strong>.
          </p>
          <label className='mt-4 cursor-pointer'>
            <span className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'text-xs gap-1.5'
    })}>
              {isUploadingFile ? <>
                  <Loader2Icon className='size-3.5 animate-spin'/> Uploading...
                </> : <>
                  <UploadCloudIcon className='size-3.5'/> Browse Local File
                </>}
            </span>
            <input type='file' accept='image/*,video/*' onChange={handleFileUpload} disabled={isUploadingFile} className='hidden'/>
          </label>
        </CardContent>
      </Card>

      { /* Filter and Search Bar */ }
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative w-full sm:w-80'>
          <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2'/>
          <Input placeholder='Search assets by filename...' className='pl-8 text-xs h-8' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div className='flex items-center gap-1.5'>
          <Button variant={typeFilter === 'all' ? 'default' : 'outline'} size='sm' className="h-8 text-xs" onClick={()=>setTypeFilter('all')}>
            All Types
          </Button>
          <Button variant={typeFilter === 'image' ? 'default' : 'outline'} size='sm' className="h-8 text-xs" onClick={()=>setTypeFilter('image')}>
            Images Only
          </Button>
          <Button variant={typeFilter === 'video' ? 'default' : 'outline'} size='sm' className="h-8 text-xs" onClick={()=>setTypeFilter('video')}>
            Video
          </Button>
        </div>
      </div>

      { /* Media Grid */ }
      {loading ? <div className='flex h-48 items-center justify-center'>
          <Loader2Icon className='size-8 animate-spin text-muted-foreground'/>
        </div> : mediaList.length === 0 ? <Card>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center space-y-2'>
            <FolderOpenIcon className="size-10 text-muted-foreground"/>
            <p className='text-sm font-semibold text-foreground'>No media assets found</p>
            <p className='text-xs text-muted-foreground max-w-sm'>
              {isAdmin ? 'No media assets match your active search filter.' : 'You have not uploaded any media items under your account yet. Use the upload button above to add assets.'}
            </p>
          </CardContent>
        </Card> : <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
          {mediaList.map((file)=><Card key={file.id} className='overflow-hidden group hover:border-foreground/50 transition-colors'>
              <div className='bg-muted/40 aspect-video relative flex items-center justify-center overflow-hidden border-b'>
                { /* eslint-disable-next-line @next/next/no-img-element */ }
                <img src={file.url} alt={file.name} className='h-full w-full object-cover transition-all duration-300 group-hover:scale-102' onError={(e)=>{
            ;
            e.target.style.display = 'none';
        }}/>
              </div>
              <CardContent className='space-y-2 p-3.5'>
                <div className='truncate text-xs font-semibold text-foreground' title={file.name}>
                  {file.name}
                </div>

                <div className='flex items-center justify-between text-[11px] text-muted-foreground font-mono'>
                  <span>{formatSize(file.size)}</span>
                  <span>{new Date(file.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}</span>
                </div>

                { /* Uploader Attribution Badge */ }
                <div className="flex items-center justify-between pt-1 border-t text-[11px]">
                  <div className="flex items-center gap-1.5 truncate text-muted-foreground">
                    <UserIcon className="size-3 shrink-0"/>
                    <span className="truncate" title={`Uploader: ${file.user?.name || 'Staff'}`}>
                      {file.user?.name || 'Newsroom Staff'}
                    </span>
                  </div>
                  {file.user && <Badge variant="outline" className="text-[9px] font-mono px-1 py-0 uppercase">
                      {file.user.role}
                    </Badge>}
                </div>

                { /* Action Buttons */ }
                <div className='flex items-center justify-between border-t pt-2.5'>
                  <Button variant='ghost' size='sm' className='h-7 gap-1 text-[11px]' onClick={()=>handleCopyUrl(file.id, file.url)}>
                    {copiedId === file.id ? <CheckIcon className='size-3 text-foreground'/> : <CopyIcon className='size-3'/>}
                    {copiedId === file.id ? 'Copied' : 'Copy URL'}
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button variant='ghost' size='icon' className='size-7' render={<a href={file.url} target="_blank" rel="noreferrer" title="Open Original Asset">
                          <ExternalLinkIcon className='size-3.5'/>
                        </a>}/>
                    <Button variant='ghost' size='icon' className='size-7 text-destructive hover:bg-destructive/10' onClick={()=>handleDelete(file.id)} title="Delete Asset">
                      <Trash2Icon className='size-3.5'/>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </div>;
}
