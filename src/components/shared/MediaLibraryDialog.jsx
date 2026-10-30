'use client';
import { useState, useEffect } from 'react';
import { SearchIcon, UploadCloudIcon, CheckIcon, ImageIcon, Loader2Icon, UserIcon, ShieldIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function MediaLibraryDialog({ open, onOpenChange, onSelect, title = 'Select Media Asset from Library', description = 'Browse newsroom photography and media assets. Permissions apply according to your role.', allowedTypes = 'image' }) {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeUser, setActiveUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    // Upload inside dialog state
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState(null);
    // Load available users list once for identity switching
    useEffect(()=>{
        async function fetchUsers() {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    if (data.users && data.users.length > 0) {
                        setAvailableUsers(data.users);
                    }
                }
            } catch  {
            // Fallback
            }
        }
        fetchUsers();
    }, []);
    // Fetch media records based on currently active user identity and search
    const fetchMedia = async ()=>{
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search.trim()) params.set('search', search.trim());
            if (allowedTypes !== 'all') params.set('type', allowedTypes);
            if (selectedUserId) params.set('userId', selectedUserId);
            const res = await fetch(`/api/media?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setMediaList(data.media || []);
                setActiveUser(data.currentUser);
                setIsAdmin(Boolean(data.isAdmin));
                if (!selectedUserId && data.currentUser) {
                    setSelectedUserId(data.currentUser.id);
                }
            } else {
                toast.error(data.error || 'Failed to load media assets');
            }
        } catch  {
            toast.error('Network error loading media');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        if (open) {
            fetchMedia();
        }
    }, [
        open,
        search,
        selectedUserId,
        allowedTypes
    ]);
    // Direct upload inside modal
    const handleModalUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
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
                fetchMedia();
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch  {
            toast.error('Network error uploading asset');
        } finally{
            setIsUploading(false);
            e.target.value = '';
        }
    };
    const handleConfirmSelect = ()=>{
        const asset = mediaList.find((m)=>m.id === selectedAssetId);
        if (!asset) {
            toast.error('Please click on an image to select it');
            return;
        }
        onSelect(asset);
        onOpenChange(false);
        setSelectedAssetId(null);
    };
    const formatSize = (bytes)=>{
        if (!bytes) return '240 KB';
        if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${Math.round(bytes / 1024)} KB`;
    };
    return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-3 border-b space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <DialogTitle className="text-lg font-bold tracking-tight">{title}</DialogTitle>
            { /* Active User Switcher / Identity Badge */ }
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">User Identity:</span>
              <Select value={selectedUserId} onValueChange={(val)=>{
        if (val) setSelectedUserId(val);
    }}>
                <SelectTrigger className="text-xs h-7 w-[200px] font-medium bg-muted/40">
                  <SelectValue placeholder="Switch User Role"/>
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u)=><SelectItem key={u.id} value={u.id} className="text-xs">
                      {u.name} ({u.role})
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        { /* Status ribbon regarding admin / non-admin visibility */ }
        <div className="py-2 px-3 my-2 rounded-md bg-muted/40 border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isAdmin ? <ShieldIcon className="size-3.5 text-foreground"/> : <UserIcon className="size-3.5 text-muted-foreground"/>}
            <span className="font-semibold">
              {isAdmin ? 'Administrator Mode' : 'Author / Staff Mode'}:
            </span>
            <span className="text-muted-foreground">
              {isAdmin ? 'You can view and select from all uploaded newsroom assets.' : 'Role isolation active — you can only see and select your own uploaded assets.'}
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {mediaList.length} ASSETS VISIBLE
          </Badge>
        </div>

        { /* Search & Upload Bar */ }
        <div className="flex flex-col sm:flex-row items-center gap-2 py-2">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"/>
            <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search assets by filename or caption..." className="text-xs pl-8 h-8"/>
          </div>

          <label className="shrink-0 cursor-pointer">
            <span className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'h-8 text-xs gap-1.5'
    })}>
              {isUploading ? <>
                  <Loader2Icon className="size-3.5 animate-spin"/> Uploading...
                </> : <>
                  <UploadCloudIcon className="size-3.5"/> Upload New Asset
                </>}
            </span>
            <input type="file" accept="image/*" onChange={handleModalUpload} disabled={isUploading} className="hidden"/>
          </label>
        </div>

        { /* Media Grid */ }
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[420px] p-1 border rounded-md bg-muted/10">
          {loading ? <div className="flex h-64 items-center justify-center">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground"/>
            </div> : mediaList.length === 0 ? <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-2">
              <ImageIcon className="size-8 text-muted-foreground"/>
              <p className="text-xs font-semibold text-foreground">No media assets found</p>
              <p className="text-[11px] text-muted-foreground max-w-sm">
                {isAdmin ? 'No photos currently match your search.' : 'You have not uploaded any photos under this account yet. Click "Upload New Asset" to add your first photo.'}
              </p>
            </div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2">
              {mediaList.map((asset)=>{
        const isSelected = selectedAssetId === asset.id;
        return <div key={asset.id} onClick={()=>setSelectedAssetId(asset.id)} className={`group relative rounded-md border overflow-hidden cursor-pointer transition-all bg-card ${isSelected ? 'ring-2 ring-foreground border-foreground shadow-md' : 'hover:border-foreground/60'}`}>
                    <div className="aspect-video relative bg-muted/30 overflow-hidden flex items-center justify-center">
                      { /* eslint-disable-next-line @next/next/no-img-element */ }
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e)=>{
            ;
            e.target.style.display = 'none';
        }}/>
                      {isSelected && <div className="absolute top-1.5 right-1.5 bg-foreground text-background rounded-full p-1 shadow-sm">
                          <CheckIcon className="size-3"/>
                        </div>}
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="text-[11px] font-medium truncate text-foreground" title={asset.name}>
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>{formatSize(asset.size)}</span>
                        {asset.user ? <span className="truncate max-w-[90px]" title={`Uploaded by: ${asset.user.name}`}>
                            By: {asset.user.name.split(' ')[0]}
                          </span> : <span>Staff</span>}
                      </div>
                    </div>
                  </div>;
    })}
            </div>}
        </div>

        { /* Footer */ }
        <DialogFooter className="pt-3 border-t flex flex-row items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground truncate">
            {selectedAssetId ? <span className="font-medium text-foreground">
                Selected: {mediaList.find((m)=>m.id === selectedAssetId)?.name}
              </span> : 'Click an asset to select'}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={()=>onOpenChange(false)} className="text-xs h-8">
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={!selectedAssetId} onClick={handleConfirmSelect} className="text-xs h-8 font-medium">
              Use Selected Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
