'use client';
import { useState } from 'react';
import { UploadCloudIcon, ImageIcon, Trash2Icon, Loader2Icon, FolderOpenIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MediaLibraryDialog } from './MediaLibraryDialog';
export function ImagePicker({ value, onChange, label: label1, description, aspectRatio = 'video', currentUserId, disabled = false }) {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    // Direct file upload to Cloudinary
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const fd = new FormData();
            fd.append('file', file);
            if (currentUserId) fd.append('userId', currentUserId);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: currentUserId ? {
                    'x-user-id': currentUserId
                } : {},
                body: fd
            });
            const data = await res.json();
            if (data.success && data.url) {
                onChange(data.url);
                toast.success('Image uploaded and applied via Cloudinary');
            } else {
                toast.error(data.error || 'Failed to upload image');
            }
        } catch  {
            toast.error('Network error uploading image');
        } finally{
            setIsUploading(false);
            e.target.value = '';
        }
    };
    const handleLibrarySelect = (asset)=>{
        onChange(asset.url);
        toast.success(`Selected "${asset.name}" from Media Library`);
    };
    const getAspectClass = ()=>{
        switch(aspectRatio){
            case 'square':
                return 'aspect-square max-w-[200px]';
            case 'banner':
                return 'aspect-[21/9] max-h-48';
            case 'video':
            default:
                return 'aspect-video max-h-64';
        }
    };
    return <div className="space-y-2">
      {label1 && <Label className="text-xs font-semibold">{label1}</Label>}

      {value ? // Preview State with Actions
    <div className="space-y-2.5">
          <div className={`relative border rounded-lg overflow-hidden bg-muted/40 w-full flex items-center justify-center ${getAspectClass()}`}>
            { /* eslint-disable-next-line @next/next/no-img-element */ }
            <img src={value} alt="Selected Asset" className="w-full h-full object-cover" onError={(e)=>{
        ;
        e.target.style.opacity = '0.3';
    }}/>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-xs" title={value}>
              {value}
            </span>

            <div className="flex items-center gap-1.5">
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={()=>setIsLibraryOpen(true)} disabled={disabled}>
                <FolderOpenIcon className="size-3.5"/> Change from Library
              </Button>

              <label className="cursor-pointer">
                <span className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'h-7 text-xs gap-1'
    })}>
                  {isUploading ? <Loader2Icon className="size-3.5 animate-spin"/> : <UploadCloudIcon className="size-3.5"/>}
                  Upload New
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading || disabled} className="hidden"/>
              </label>

              <Button type="button" variant="outline" size="sm" className="h-7 text-xs text-destructive hover:bg-destructive/10" onClick={()=>onChange('')} disabled={disabled}>
                <Trash2Icon className="mr-1 size-3.5"/> Remove
              </Button>
            </div>
          </div>
        </div> : // Empty State: Two Direct Options
    <div className="border-2 border-dashed rounded-lg p-5 text-center hover:bg-muted/20 transition-colors">
          <div className="mx-auto size-10 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground">
            <ImageIcon className="size-5"/>
          </div>
          <p className="text-xs font-semibold text-foreground">Add or Select Image</p>
          {description && <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mx-auto">{description}</p>}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
            { /* Option 1: File Upload */ }
            <label className="cursor-pointer">
              <span className={buttonVariants({
        variant: 'default',
        size: 'sm',
        className: 'text-xs gap-1.5 h-8 font-medium'
    })}>
                {isUploading ? <>
                    <Loader2Icon className="size-3.5 animate-spin"/>
                    Uploading to Cloudinary...
                  </> : <>
                    <UploadCloudIcon className="size-3.5"/>
                    Upload from Device
                  </>}
              </span>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading || disabled} className="hidden"/>
            </label>

            { /* Option 2: Select from Media Library */ }
            <Button type="button" variant="outline" size="sm" onClick={()=>setIsLibraryOpen(true)} disabled={disabled} className="text-xs gap-1.5 h-8 font-medium">
              <FolderOpenIcon className="size-3.5"/>
              Choose from Media Library
            </Button>
          </div>
        </div>}

      { /* Reusable Modal Dialog */ }
      <MediaLibraryDialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen} onSelect={handleLibrarySelect} title={label1 ? `Choose ${label1}` : 'Select Image from Media Library'}/>
    </div>;
}
