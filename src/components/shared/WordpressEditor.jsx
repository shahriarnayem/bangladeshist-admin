'use client';
import { useState, useRef } from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, QuoteIcon, ListIcon, ListOrderedIcon, CheckSquareIcon, CodeIcon, TableIcon, MinusIcon, LinkIcon, ImageIcon, EyeIcon, EditIcon, UploadCloudIcon, FolderOpenIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MediaLibraryDialog } from './MediaLibraryDialog';
// Inline Markdown Parser: handles [text](url), **bold**, *italic*, and `code` safely into React nodes
function renderInlineText(text) {
    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
    const result = [];
    let lastIndex = 0;
    let match;
    while((match = regex.exec(text)) !== null){
        if (match.index > lastIndex) {
            result.push(text.substring(lastIndex, match.index));
        }
        const [full, , linkText, linkUrl, boldText, italicText, codeText] = match;
        if (linkText && linkUrl) {
            result.push(<a key={match.index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2 text-foreground hover:text-foreground/80 decoration-foreground/40 hover:decoration-foreground">
          {linkText}
        </a>);
        } else if (boldText) {
            result.push(<strong key={match.index} className="font-bold text-foreground">
          {boldText}
        </strong>);
        } else if (italicText) {
            result.push(<em key={match.index} className="italic">
          {italicText}
        </em>);
        } else if (codeText) {
            result.push(<code key={match.index} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground border">
          {codeText}
        </code>);
        }
        lastIndex = match.index + full.length;
    }
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }
    return result;
}
export function WordpressEditor({ value, onChange, placeholder = 'Draft your editorial story here...', minHeight = '420px', authorId }) {
    const textareaRef = useRef(null);
    const [activeTab, setActiveTab] = useState('write');
    // Link Dialog State
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkNewTab, setLinkNewTab] = useState(true);
    // Image Insert Dialog State
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const [imageCaption, setImageCaption] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    // Table Generator Dialog
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    // Helpers to insert or wrap markdown at current cursor position
    const wrapSelection = (prefix, suffix = '', defaultText = 'text')=>{
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end) || defaultText;
        const replacement = `${prefix}${selected}${suffix}`;
        const nextValue = value.substring(0, start) + replacement + value.substring(end);
        onChange(nextValue);
        setTimeout(()=>{
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
        }, 0);
    };
    const insertBlock = (block)=>{
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const prefix = start > 0 && !value.endsWith('\n') ? '\n\n' : '';
        const replacement = `${prefix}${block}\n\n`;
        const nextValue = value.substring(0, start) + replacement + value.substring(end);
        onChange(nextValue);
        setTimeout(()=>{
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        }, 0);
    };
    // Insert Link
    const handleInsertLink = (e)=>{
        e.preventDefault();
        if (!linkUrl.trim()) {
            toast.error('URL is required');
            return;
        }
        const anchor = linkText.trim() || linkUrl.trim();
        const targetSuffix = linkNewTab ? '{:target="_blank"}' : '';
        const md = `[${anchor}](${linkUrl.trim()})${targetSuffix}`;
        wrapSelection('', '', md);
        setIsLinkDialogOpen(false);
        setLinkText('');
        setLinkUrl('');
    };
    // Upload inline image from device
    const handleUploadImage = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingImage(true);
            const fd = new FormData();
            fd.append('file', file);
            if (authorId) fd.append('userId', authorId);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: authorId ? {
                    'x-user-id': authorId
                } : {},
                body: fd
            });
            const data = await res.json();
            if (data.success && data.url) {
                const alt = imageCaption.trim() || 'Editorial Illustration';
                const md = `\n\n![${alt}](${data.url})\n*${alt}*\n\n`;
                insertBlock(md);
                toast.success('Photo uploaded to Cloudinary & inserted');
                setIsImageDialogOpen(false);
                setImageCaption('');
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch  {
            toast.error('Network error uploading photo');
        } finally{
            setIsUploadingImage(false);
            e.target.value = '';
        }
    };
    // Select image from Media Library
    const handleLibrarySelect = (asset)=>{
        const alt = imageCaption.trim() || asset.caption || asset.name;
        const md = `\n\n![${alt}](${asset.url})\n*${alt}*\n\n`;
        insertBlock(md);
        setIsImageDialogOpen(false);
        setIsLibraryDialogOpen(false);
        setImageCaption('');
        toast.success(`Embedded "${asset.name}" from Media Library`);
    };
    // Generate Table Markdown
    const handleInsertTable = ()=>{
        let headerRow = '|';
        let dividerRow = '|';
        for(let c = 1; c <= tableCols; c++){
            headerRow += ` Column ${c} |`;
            dividerRow += ' --- |';
        }
        let rowsStr = '';
        for(let r = 1; r <= tableRows; r++){
            let row = '|';
            for(let c = 1; c <= tableCols; c++){
                row += ` Data ${r}.${c} |`;
            }
            rowsStr += `\n${row}`;
        }
        const tableMd = `${headerRow}\n${dividerRow}${rowsStr}`;
        insertBlock(tableMd);
        setIsTableDialogOpen(false);
        toast.success('Table inserted');
    };
    // Word & Reading Stats Calculation
    const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordsCount / 220));
    const charsCount = value.length;
    return <div className="border rounded-lg bg-card overflow-hidden shadow-xs">
      { /* Top Header / Mode Switcher */ }
      <div className="flex flex-wrap items-center justify-between border-b px-3 py-2 bg-muted/40 gap-2">
        <div className="flex items-center gap-1">
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
            Newsroom Desk
          </span>
          <span className="text-muted-foreground text-xs font-mono">• WordPress Engine</span>
        </div>

        { /* Write / Live Broadsheet Preview Tabs */ }
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md text-xs">
          <button type="button" onClick={()=>setActiveTab('write')} className={`flex items-center gap-1 px-3 py-1 rounded transition-all font-medium ${activeTab === 'write' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}>
            <EditIcon className="size-3"/> Visual Write
          </button>
          <button type="button" onClick={()=>setActiveTab('preview')} className={`flex items-center gap-1 px-3 py-1 rounded transition-all font-medium ${activeTab === 'preview' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}>
            <EyeIcon className="size-3"/> Live Preview
          </button>
        </div>
      </div>

      { /* WordPress Journalistic Toolbar */ }
      {activeTab === 'write' && <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/20 border-b text-xs">
          { /* Headings */ }
          <div className="flex items-center gap-0.5">
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold font-serif" onClick={()=>insertBlock('# Lead Headline (H1)')} title="Headline (H1)">
              <Heading1Icon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold font-serif" onClick={()=>insertBlock('## Section Heading (H2)')} title="Major Section (H2)">
              <Heading2Icon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold font-serif" onClick={()=>insertBlock('### Subsection (H3)')} title="Subsection (H3)">
              <Heading3Icon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold font-serif" onClick={()=>insertBlock('#### Minor Heading (H4)')} title="Minor Heading (H4)">
              <Heading4Icon className="size-3.5"/>
            </Button>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1"/>

          { /* Text Styles */ }
          <div className="flex items-center gap-0.5">
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>wrapSelection('**', '**', 'bold text')} title="Bold (Ctrl+B)">
              <BoldIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>wrapSelection('*', '*', 'italic text')} title="Italic (Ctrl+I)">
              <ItalicIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>wrapSelection('<u>', '</u>', 'underlined text')} title="Underline">
              <UnderlineIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>wrapSelection('~~', '~~', 'strikethrough')} title="Strikethrough">
              <StrikethroughIcon className="size-3.5"/>
            </Button>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1"/>

          { /* Quotes and Lists */ }
          <div className="flex items-center gap-0.5">
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>insertBlock('> "Quoted statement from official source or interview."\n> — Source Attribution')} title="Pull Quote / Blockquote">
              <QuoteIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>insertBlock('- First bulleted point\n- Second bulleted point\n- Third bulleted point')} title="Bulleted List">
              <ListIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>insertBlock('1. Primary sequential stage\n2. Secondary stage\n3. Conclusion')} title="Numbered List">
              <ListOrderedIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>insertBlock('- [ ] Pending item\n- [x] Verified fact')} title="Checklist / Task List">
              <CheckSquareIcon className="size-3.5"/>
            </Button>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1"/>

          { /* Code, Table, Divider */ }
          <div className="flex items-center gap-0.5">
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>wrapSelection('`', '`', 'inlineCode')} title="Inline Code">
              <CodeIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>setIsTableDialogOpen(true)} title="Insert Formatted Table">
              <TableIcon className="size-3.5"/>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={()=>insertBlock('---')} title="Horizontal Divider">
              <MinusIcon className="size-3.5"/>
            </Button>
          </div>

          <div className="w-[1px] h-4 bg-border mx-1"/>

          { /* Media & Link Action Buttons */ }
          <div className="flex items-center gap-1 ml-auto">
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={()=>setIsLinkDialogOpen(true)} title="Insert Hyperlink">
              <LinkIcon className="size-3.5"/>
              <span>Link</span>
            </Button>
            <Button type="button" variant="default" size="sm" className="h-7 text-xs gap-1 font-medium" onClick={()=>setIsImageDialogOpen(true)} title="Upload or Select Image">
              <ImageIcon className="size-3.5"/>
              <span>Add Media</span>
            </Button>
          </div>
        </div>}

      { /* Editor Content Area */ }
      <div className="relative">
        {activeTab === 'write' ? <Textarea ref={textareaRef} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} style={{
        minHeight
    }} className="w-full rounded-none border-0 p-4 font-mono text-xs leading-relaxed focus-visible:ring-0 resize-y"/> : /* Live Broadsheet Preview */ <div style={{
        minHeight
    }} className="p-6 bg-muted/10 font-serif leading-relaxed text-sm space-y-4 max-w-none">
            {value.trim() ? value.split('\n\n').map((block, idx)=>{
        const trimmed = block.trim();
        // H1
        if (trimmed.startsWith('# ')) {
            return <h1 key={idx} className="font-serif font-black text-2xl sm:text-3xl text-foreground tracking-tight border-b pb-2 mt-4">
                      {renderInlineText(trimmed.replace('# ', ''))}
                    </h1>;
        }
        // H2
        if (trimmed.startsWith('## ')) {
            return <h2 key={idx} className="font-sans font-bold text-xl text-foreground tracking-tight mt-5 mb-2">
                      {renderInlineText(trimmed.replace('## ', ''))}
                    </h2>;
        }
        // H3
        if (trimmed.startsWith('### ')) {
            return <h3 key={idx} className="font-sans font-semibold text-base text-foreground mt-4 mb-1">
                      {renderInlineText(trimmed.replace('### ', ''))}
                    </h3>;
        }
        // H4
        if (trimmed.startsWith('#### ')) {
            return <h4 key={idx} className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-3 mb-1">
                      {renderInlineText(trimmed.replace('#### ', ''))}
                    </h4>;
        }
        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***') {
            return <hr key={idx} className="my-6 border-border"/>;
        }
        // Code Block (Fenced ```)
        if (trimmed.startsWith('```')) {
            const lines = trimmed.split('\n');
            const lang = lines[0].replace('```', '').trim();
            const code1 = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
            return <div key={idx} className="my-4 rounded-md border bg-muted/60 overflow-hidden font-mono text-xs">
                      {lang && <div className="bg-muted px-3 py-1 text-[10px] uppercase font-semibold text-muted-foreground border-b tracking-wider">
                          {lang}
                        </div>}
                      <pre className="p-3.5 overflow-x-auto text-[11px] leading-relaxed">
                        <code>{code1}</code>
                      </pre>
                    </div>;
        }
        // Blockquote
        if (trimmed.startsWith('> ')) {
            const quoteLines = trimmed.split('\n> ');
            return <blockquote key={idx} className="border-l-4 border-foreground pl-4 py-1 italic font-serif text-foreground/90 my-3 bg-muted/20 rounded-r">
                      {quoteLines.map((line, qIdx)=><p key={qIdx} className="leading-relaxed">
                          {renderInlineText(line.replace(/^> /, ''))}
                        </p>)}
                    </blockquote>;
        }
        // Task Checklist (- [ ] or - [x])
        if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
            const items = trimmed.split('\n');
            return <ul key={idx} className="space-y-1.5 font-sans text-xs my-2.5">
                      {items.map((item, i)=>{
                const isChecked = item.trim().startsWith('- [x]');
                const itemText = item.trim().replace(/^- \[[ x]\]\s*/, '');
                return <li key={i} className="flex items-center gap-2">
                            <input type="checkbox" checked={isChecked} readOnly className="rounded border-muted pointer-events-none size-3.5"/>
                            <span className={isChecked ? 'line-through text-muted-foreground' : ''}>
                              {renderInlineText(itemText)}
                            </span>
                          </li>;
            })}
                    </ul>;
        }
        // Bulleted List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n[-*] /);
            return <ul key={idx} className="list-disc list-inside space-y-1 font-sans text-xs my-2 pl-2">
                      {items.map((item, i)=><li key={i}>{renderInlineText(item.replace(/^[-*] /, ''))}</li>)}
                    </ul>;
        }
        // Numbered List
        if (/^\d+\. /.test(trimmed)) {
            const items = trimmed.split(/\n\d+\. /);
            return <ol key={idx} className="list-decimal list-inside space-y-1 font-sans text-xs my-2 pl-2">
                      {items.map((item, i)=><li key={i}>{renderInlineText(item.replace(/^\d+\. /, ''))}</li>)}
                    </ol>;
        }
        // Tables
        if (trimmed.includes('|') && trimmed.includes('\n|')) {
            const rows = trimmed.split('\n').filter((r)=>r.trim().startsWith('|'));
            if (rows.length >= 2) {
                const headerCells = rows[0].split('|').filter((c)=>c.trim());
                const dataRows = rows.slice(2);
                return <div key={idx} className="overflow-x-auto my-4 border rounded-md">
                        <table className="w-full text-xs font-sans text-left border-collapse">
                          <thead className="bg-muted/60 border-b">
                            <tr>
                              {headerCells.map((h, hIdx)=><th key={hIdx} className="p-2.5 font-bold border-r last:border-r-0">
                                  {renderInlineText(h.trim())}
                                </th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, rIdx)=>{
                    const cells = row.split('|').filter((c)=>c.trim());
                    return <tr key={rIdx} className="border-b last:border-b-0 hover:bg-muted/20">
                                  {cells.map((cell, cIdx)=><td key={cIdx} className="p-2 border-r last:border-r-0">
                                      {renderInlineText(cell.trim())}
                                    </td>)}
                                </tr>;
                })}
                          </tbody>
                        </table>
                      </div>;
            }
        }
        // Image with Caption Embed
        if (trimmed.startsWith('![') && trimmed.includes('](')) {
            const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                return <figure key={idx} className="my-5 space-y-1.5 text-center">
                        <div className="overflow-hidden rounded-lg border bg-muted/40 max-h-[460px] flex items-center justify-center">
                          { /* eslint-disable-next-line @next/next/no-img-element */ }
                          <img src={match[2]} alt={match[1]} className="w-full h-full object-cover max-h-[460px]" onError={(e)=>{
                    ;
                    e.target.style.display = 'none';
                }}/>
                        </div>
                        {match[1] && <figcaption className="text-xs font-sans text-muted-foreground italic">
                            Photo: {match[1]}
                          </figcaption>}
                      </figure>;
            }
        }
        // Standard Paragraph
        return <p key={idx} className="font-sans text-xs text-foreground/90 leading-relaxed">
                    {renderInlineText(trimmed)}
                  </p>;
    }) : <div className="py-20 text-center text-xs text-muted-foreground font-sans">
                No story content drafted yet. Switch to "Visual Write" mode to compose.
              </div>}
          </div>}
      </div>

      { /* Bottom Status Bar (Word Count & Reading Time) */ }
      <div className="flex items-center justify-between border-t px-3 py-1.5 bg-muted/30 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{wordsCount} Words</span>
          <span>•</span>
          <span>{charsCount} Characters</span>
          <span>•</span>
          <span>{readingTime} Min Read</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Markdown GFM</span>
        </div>
      </div>

      { /* Insert Hyperlink Dialog */ }
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleInsertLink}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Insert Citation / Hyperlink</DialogTitle>
              <DialogDescription className="text-xs">
                Add an anchor text and destination web link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label htmlFor="link-text" className="text-xs">Display Anchor Text</Label>
                <Input id="link-text" placeholder="e.g. read the official whitepaper" value={linkText} onChange={(e)=>setLinkText(e.target.value)} className="text-xs"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="link-url" className="text-xs">Target Web URL *</Label>
                <Input id="link-url" placeholder="https://..." value={linkUrl} onChange={(e)=>setLinkUrl(e.target.value)} className="text-xs font-mono" required/>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <input type="checkbox" id="link-newtab" checked={linkNewTab} onChange={(e)=>setLinkNewTab(e.target.checked)} className="rounded border-muted"/>
                <label htmlFor="link-newtab" className="cursor-pointer">
                  Open link in new browser tab
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={()=>setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Insert Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      { /* Insert Image Dialog with Upload AND Select from Media Library */ }
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Embed Photojournalism Asset</DialogTitle>
            <DialogDescription className="text-xs">
              Upload photo from device or choose an asset from your Media Library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Caption / Alt Description</Label>
              <Input placeholder="e.g. Treasury Secretary during press briefing" value={imageCaption} onChange={(e)=>setImageCaption(e.target.value)} className="text-xs"/>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              { /* Option 1: Direct File Upload to Cloudinary */ }
              <label className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors">
                {isUploadingImage ? <Loader2Icon className="size-6 animate-spin text-muted-foreground"/> : <UploadCloudIcon className="size-6 text-muted-foreground"/>}
                <span className="mt-2 text-xs font-semibold">Upload from Device</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Direct to Cloudinary</span>
                <input type="file" accept="image/*" className="hidden" disabled={isUploadingImage} onChange={handleUploadImage}/>
              </label>

              { /* Option 2: Choose from Media Library */ }
              <div onClick={()=>setIsLibraryDialogOpen(true)} className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors">
                <FolderOpenIcon className="size-6 text-muted-foreground"/>
                <span className="mt-2 text-xs font-semibold">Media Library</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Choose Existing</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={()=>setIsImageDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      { /* Media Library Modal for Image Insertion */ }
      <MediaLibraryDialog open={isLibraryDialogOpen} onOpenChange={setIsLibraryDialogOpen} onSelect={handleLibrarySelect} title="Select Media Asset to Embed"/>

      { /* Table Generator Dialog */ }
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Insert Data Table</DialogTitle>
            <DialogDescription className="text-xs">
              Configure grid columns and rows.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Columns</Label>
              <Input type="number" min={1} max={8} value={tableCols} onChange={(e)=>setTableCols(Number(e.target.value) || 2)} className="text-xs h-8"/>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Rows</Label>
              <Input type="number" min={1} max={20} value={tableRows} onChange={(e)=>setTableRows(Number(e.target.value) || 2)} className="text-xs h-8"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={()=>setIsTableDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleInsertTable}>
              Generate Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
