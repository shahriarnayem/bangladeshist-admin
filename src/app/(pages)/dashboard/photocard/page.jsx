'use client';
import { useState, useRef } from 'react';
import { SparklesIcon, DownloadIcon, Share2Icon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePicker } from '@/components/shared/ImagePicker';
export default function PhotocardStudioPage() {
    const [headline, setHeadline] = useState('Inside Geneva’s Rapid Metro Transit Expansion: Phase 2 Projections & Urban Mobility Shift');
    const [category, setCategory] = useState('SPECIAL INVESTIGATION');
    const [source, setSource] = useState('International Desk / Global Bureau');
    const [aspectRatio, setAspectRatio] = useState('portrait');
    const [themeMode, setThemeMode] = useState('dark');
    const [cardImage, setCardImage] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const canvasRef = useRef(null);
    const handleDownloadImage = ()=>{
        try {
            setIsExporting(true);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            const width = 1080;
            const height = aspectRatio === 'portrait' ? 1350 : 1080;
            canvas.width = width;
            canvas.height = height;
            const isDark = themeMode === 'dark';
            const bgColor = isDark ? '#000000' : '#ffffff';
            const textColor = isDark ? '#ffffff' : '#000000';
            const mutedColor = isDark ? '#a1a1aa' : '#52525b';
            const borderColor = isDark ? '#27272a' : '#e4e4e7';
            // Background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            // Outer border
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 4;
            ctx.strokeRect(30, 30, width - 60, height - 60);
            // Header line: The Chronicle branding
            ctx.fillStyle = textColor;
            ctx.font = 'bold 36px monospace';
            ctx.fillText('THE CHRONICLE', 70, 110);
            // Category Tag Box
            ctx.strokeStyle = mutedColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(width - 380, 75, 310, 48);
            ctx.fillStyle = mutedColor;
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(category.toUpperCase(), width - 225, 108);
            ctx.textAlign = 'left';
            // Divider line
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(70, 150);
            ctx.lineTo(width - 70, 150);
            ctx.stroke();
            // Main headline wrapping
            ctx.fillStyle = textColor;
            ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
            const maxWidth = width - 140;
            const lineHeight = 72;
            let y = height / 2 - 120;
            const words = headline.split(' ');
            let line = '';
            for(let n = 0; n < words.length; n++){
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, 70, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, 70, y);
            // Sub-caption
            y += 50;
            ctx.fillStyle = mutedColor;
            ctx.font = '26px system-ui, sans-serif';
            ctx.fillText('Field reporting and investigative editorial analysis.', 70, y);
            // Bottom footer divider
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(70, height - 140);
            ctx.lineTo(width - 70, height - 140);
            ctx.stroke();
            // Footer: Source and URL
            ctx.fillStyle = mutedColor;
            ctx.font = '24px monospace';
            ctx.fillText(source, 70, height - 90);
            ctx.fillStyle = textColor;
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'right';
            ctx.fillText('thechronicle.press', width - 70, height - 90);
            // Export file
            const link = document.createElement('a');
            link.download = `thechronicle-photocard-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('High-resolution editorial photocard exported');
        } catch  {
            toast.error('Failed to render canvas photocard');
        } finally{
            setIsExporting(false);
        }
    };
    return <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
            <SparklesIcon className='size-6 text-foreground'/>
            Photocard Studio
          </h1>
          <p className='text-muted-foreground text-sm'>
            Create and generate high-resolution editorial photocards for Facebook, Instagram, and X.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' className='gap-2' onClick={()=>{
        navigator.clipboard.writeText(headline);
        toast.success('Headline copy copied to clipboard');
    }}>
            <Share2Icon className='size-4'/> Share Text
          </Button>
          <Button className='gap-2' onClick={handleDownloadImage} disabled={isExporting}>
            {isExporting ? <Loader2Icon className='size-4 animate-spin'/> : <DownloadIcon className='size-4'/>}
            Download High-Res (PNG)
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        { /* Studio Controls */ }
        <div className='space-y-6 lg:col-span-5'>
          <Card>
            <CardHeader>
              <CardTitle>Card Content & Typography</CardTitle>
              <CardDescription>Customize the news photocard layout and messaging.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Aspect Ratio / Format</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Button variant={aspectRatio === 'portrait' ? 'default' : 'outline'} size='sm' onClick={()=>setAspectRatio('portrait')}>
                    Portrait (4:5 / Social Feed)
                  </Button>
                  <Button variant={aspectRatio === 'square' ? 'default' : 'outline'} size='sm' onClick={()=>setAspectRatio('square')}>
                    Square (1:1 / Grid)
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Beat Ribbon / Category Tag</Label>
                <Input value={category} onChange={(e)=>setCategory(e.target.value)}/>
              </div>

              <div className='space-y-2'>
                <Label>Headline Copy</Label>
                <Textarea value={headline} onChange={(e)=>setHeadline(e.target.value)} rows={4} className='text-base font-medium'/>
              </div>

              <div className='space-y-2'>
                <Label>Source / Bureau Attribution</Label>
                <Input value={source} onChange={(e)=>setSource(e.target.value)}/>
              </div>

              <div className='space-y-2'>
                <Label>Card Theme Mode</Label>
                <Select value={themeMode} onValueChange={(v)=>{
        if (v) setThemeMode(v);
    }}>
                  <SelectTrigger className='w-full'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dark'>Deep Monochrome (High Contrast)</SelectItem>
                    <SelectItem value='light'>Clean Paper White</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='border-t pt-3'>
                <ImagePicker label="Lead Card Photography" value={cardImage} onChange={setCardImage} aspectRatio="video" description="Upload asset via Cloudinary or choose from Media Library."/>
              </div>
            </CardContent>
          </Card>
        </div>

        { /* Studio Live Canvas Preview */ }
        <div className='flex flex-col items-center justify-center lg:col-span-7'>
          <div className='bg-muted/40 flex w-full items-center justify-center rounded-xl border p-6'>
            <div className={`relative flex flex-col justify-between overflow-hidden rounded-lg p-6 shadow-2xl transition-all duration-300 ${aspectRatio === 'portrait' ? 'h-[450px] w-[360px]' : 'h-[360px] w-[360px]'} ${themeMode === 'dark' ? 'border border-neutral-800 bg-black text-white' : 'border border-neutral-300 bg-white text-black'}`}>
              { /* Header Branding */ }
              <div className={`flex items-center justify-between border-b pb-3 ${themeMode === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className='flex items-center gap-2'>
                  <div className={`flex size-5 items-center justify-center rounded-full text-[10px] font-black ${themeMode === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    B
                  </div>
                  <span className='text-xs font-bold uppercase tracking-widest'>The Chronicle</span>
                </div>
                <Badge variant='outline' className={`font-mono text-[10px] ${themeMode === 'dark' ? 'border-neutral-700 bg-neutral-900 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-700'}`}>
                  {category}
                </Badge>
              </div>

              { /* Main Headline */ }
              <div className='my-auto space-y-3 py-4'>
                <p className='text-lg font-bold leading-snug tracking-tight'>
                  {headline}
                </p>
                <p className={`line-clamp-2 text-xs font-light ${themeMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Field reporting and editorial analysis from the The Chronicle investigative newsroom desk.
                </p>
              </div>

              { /* Footer Attribution */ }
              <div className={`flex items-center justify-between border-t pt-3 text-[11px] ${themeMode === 'dark' ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'}`}>
                <span className='font-mono'>{source}</span>
                <span className='font-mono font-medium'>thechronicle.press</span>
              </div>
            </div>
          </div>
          <p className='text-muted-foreground mt-3 text-xs'>
            Live canvas renders in strict monochrome. Output resolution: 1080 × 1350 px (300 DPI ready).
          </p>
        </div>
      </div>
    </div>;
}
