'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    CodeIcon,
    QuoteIcon,
    ListIcon,
    ListOrderedIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    AlignJustifyIcon,
    TableIcon,
    MinusIcon,
    LinkIcon,
    UnlinkIcon,
    ImageIcon,
    Undo2Icon,
    Redo2Icon,
    RemoveFormattingIcon,
    UploadCloudIcon,
    FolderOpenIcon,
    Loader2Icon,
    EyeIcon,
    PencilIcon,
    Code2Icon,
    PlusIcon,
    Trash2Icon,
    SparklesIcon,
    CheckIcon,
    FileTextIcon,
    ColumnsIcon,
    RowsIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MediaLibraryDialog } from './MediaLibraryDialog';

export function WordpressEditor({
    value = '',
    onChange,
    placeholder = 'Start writing your editorial story in visual format...',
    minHeight = '480px',
    authorId
}) {
    // Modes: 'visual' (WordPress Visual/Blogger Compose), 'html' (WordPress Text/Blogger HTML), 'preview' (Live Broadsheet)
    const [viewMode, setViewMode] = useState('visual');
    const [rawHtml, setRawHtml] = useState(value || '');

    // Link Dialog State
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkNewTab, setLinkNewTab] = useState(true);

    // Media Dialogs State
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const [imageCaption, setImageCaption] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // TipTap Editor Instance
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4]
                }
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary font-medium cursor-pointer'
                }
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-md border border-border shadow-xs my-4 max-w-full h-auto mx-auto block'
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full my-4 border-collapse border border-border rounded-md text-sm'
                }
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-border bg-muted/60 p-2.5 font-semibold text-left text-xs uppercase tracking-wider'
                }
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2.5 text-left text-sm'
                }
            }),
            Placeholder.configure({
                placeholder
            })
        ],
        content: value || '',
        onUpdate: ({ editor: ed }) => {
            const html = ed.getHTML();
            setRawHtml(html);
            if (onChange) {
                onChange(html);
            }
        }
    });

    // Synchronize external value changes (e.g. on async article load)
    useEffect(() => {
        if (!editor) return;
        const currentHTML = editor.getHTML();
        if (value !== undefined && value !== currentHTML) {
            // Only update if current editor is empty or content is substantially different
            if (editor.getText().trim() === '' || Math.abs((value?.length || 0) - currentHTML.length) > 15) {
                editor.commands.setContent(value || '', false);
                setRawHtml(value || '');
            }
        }
    }, [editor, value]);

    // Handle view mode switches
    const handleSwitchMode = (newMode) => {
        if (viewMode === 'html' && newMode !== 'html') {
            // Sync HTML edits back into TipTap
            if (editor) {
                editor.commands.setContent(rawHtml, false);
                if (onChange) onChange(rawHtml);
            }
        } else if (newMode === 'html' && editor) {
            // Ensure rawHtml reflects latest visual state
            setRawHtml(editor.getHTML());
        }
        setViewMode(newMode);
    };

    // Calculate real-time stats
    const textStats = useMemo(() => {
        const text = editor ? editor.getText() : (rawHtml.replace(/<[^>]*>/g, '') || '');
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const readingMinutes = Math.max(1, Math.ceil(words / 200));
        return { words, characters, readingMinutes };
    }, [editor, rawHtml, viewMode]);

    // Format selection handler for headings / paragraphs
    const activeHeadingLevel = useMemo(() => {
        if (!editor) return 'p';
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        if (editor.isActive('heading', { level: 4 })) return 'h4';
        return 'p';
    }, [editor]);

    const handleFormatChange = (format) => {
        if (!editor) return;
        if (format === 'p') {
            editor.chain().focus().setParagraph().run();
        } else if (format === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
        } else if (format === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
        } else if (format === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
        } else if (format === 'h4') {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
    };

    // Link Action
    const openLinkDialog = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setIsLinkDialogOpen(true);
    };

    const handleSaveLink = (e) => {
        if (e) e.preventDefault();
        if (!editor) return;
        if (!linkUrl.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({
                href: linkUrl.trim(),
                target: linkNewTab ? '_blank' : null
            }).run();
        }
        setIsLinkDialogOpen(false);
        setLinkUrl('');
    };

    // Upload image from local file directly to Cloudinary
    const handleUploadLocalImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;
        try {
            setIsUploadingImage(true);
            const fd = new FormData();
            fd.append('file', file);
            if (authorId) fd.append('userId', authorId);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: authorId ? { 'x-user-id': authorId } : {},
                body: fd
            });
            const data = await res.json();
            if (data.success && data.url) {
                const alt = imageCaption.trim() || file.name.replace(/\.[^/.]+$/, '');
                editor.chain().focus().setImage({
                    src: data.url,
                    alt,
                    title: alt
                }).run();
                toast.success('Photo uploaded to Cloudinary & inserted into story');
                setIsImageDialogOpen(false);
                setImageCaption('');
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch {
            toast.error('Network error uploading image');
        } finally {
            setIsUploadingImage(false);
            e.target.value = '';
        }
    };

    // Insert image from Media Library
    const handleSelectFromLibrary = (asset) => {
        if (!editor || !asset?.url) return;
        const alt = imageCaption.trim() || asset.caption || asset.name;
        editor.chain().focus().setImage({
            src: asset.url,
            alt,
            title: alt
        }).run();
        setIsImageDialogOpen(false);
        setIsLibraryDialogOpen(false);
        setImageCaption('');
        toast.success(`Inserted "${asset.name}" from Media Library`);
    };

    // Insert image from external URL
    const handleInsertFromUrl = (e) => {
        if (e) e.preventDefault();
        if (!editor || !imageUrlInput.trim()) return;
        const alt = imageCaption.trim() || 'Editorial Illustration';
        editor.chain().focus().setImage({
            src: imageUrlInput.trim(),
            alt,
            title: alt
        }).run();
        setIsImageDialogOpen(false);
        setImageUrlInput('');
        setImageCaption('');
        toast.success('Embedded image from URL');
    };

    // Table Actions
    const handleInsertTable = () => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        toast.success('Inserted 3×3 editorial table');
    };

    const isInsideTable = editor ? editor.isActive('table') : false;

    return (
        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-xs overflow-hidden">
            {/* Top Toolbar: WordPress & Blogger.com Style Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-3 py-2 gap-2">
                {/* Left: View Mode Tabs (Visual, HTML, Live Broadsheet Preview) */}
                <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                    <button
                        type="button"
                        onClick={() => handleSwitchMode('visual')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            viewMode === 'visual'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Visual Editor (WordPress / Blogger Compose View)"
                    >
                        <PencilIcon className="size-3.5" />
                        <span>Visual</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSwitchMode('html')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            viewMode === 'html'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="HTML Source Editor (WordPress Text / Blogger HTML View)"
                    >
                        <Code2Icon className="size-3.5" />
                        <span>HTML</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSwitchMode('preview')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            viewMode === 'preview'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Live Broadsheet Reader Preview"
                    >
                        <EyeIcon className="size-3.5" />
                        <span>Preview</span>
                    </button>
                </div>

                {/* Right: Word Count & Reader Stats Badge */}
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="hidden sm:inline">
                        <strong>{textStats.words}</strong> words
                    </span>
                    <span className="text-border">•</span>
                    <span>
                        ~{textStats.readingMinutes} min read
                    </span>
                </div>
            </div>

            {/* Second Toolbar Row: Formatting Tools (Visible in Visual Mode) */}
            {viewMode === 'visual' && editor && (
                <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/15 p-2 text-foreground">
                    {/* History */}
                    <div className="flex items-center gap-0.5 pr-1 border-r border-border">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo2Icon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo2Icon className="size-4" />
                        </button>
                    </div>

                    {/* Block Heading Selector */}
                    <div className="pr-1 border-r border-border">
                        <select
                            value={activeHeadingLevel}
                            onChange={(e) => handleFormatChange(e.target.value)}
                            className="h-8 rounded border border-border bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            aria-label="Text Block Format"
                        >
                            <option value="p">Paragraph</option>
                            <option value="h1">Heading 1 (Hero)</option>
                            <option value="h2">Heading 2 (Major)</option>
                            <option value="h3">Heading 3 (Section)</option>
                            <option value="h4">Heading 4 (Subdeck)</option>
                        </select>
                    </div>

                    {/* Inline Formatting: Bold, Italic, Underline, Strike, Code */}
                    <div className="flex items-center gap-0.5 pr-1 border-r border-border">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('bold')
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Bold (Ctrl+B)"
                        >
                            <BoldIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('italic')
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Italic (Ctrl+I)"
                        >
                            <ItalicIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('underline')
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Underline (Ctrl+U)"
                        >
                            <UnderlineIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('strike')
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Strikethrough"
                        >
                            <StrikethroughIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('code')
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Inline Code"
                        >
                            <CodeIcon className="size-4" />
                        </button>
                    </div>

                    {/* Text Alignment */}
                    <div className="flex items-center gap-0.5 pr-1 border-r border-border">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive({ textAlign: 'left' })
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Align Left"
                        >
                            <AlignLeftIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive({ textAlign: 'center' })
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Align Center"
                        >
                            <AlignCenterIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive({ textAlign: 'right' })
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Align Right"
                        >
                            <AlignRightIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive({ textAlign: 'justify' })
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Justify"
                        >
                            <AlignJustifyIcon className="size-4" />
                        </button>
                    </div>

                    {/* Lists, Quote, Divider */}
                    <div className="flex items-center gap-0.5 pr-1 border-r border-border">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('bulletList')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Bulleted List"
                        >
                            <ListIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('orderedList')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Numbered List"
                        >
                            <ListOrderedIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('blockquote')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Editorial Blockquote"
                        >
                            <QuoteIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Horizontal Divider"
                        >
                            <MinusIcon className="size-4" />
                        </button>
                    </div>

                    {/* Links & Media: WordPress-Style "Add Media" */}
                    <div className="flex items-center gap-1 pr-1 border-r border-border">
                        <button
                            type="button"
                            onClick={openLinkDialog}
                            className={`p-1.5 rounded transition-colors ${
                                editor.isActive('link')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Insert / Edit Hyperlink"
                        >
                            <LinkIcon className="size-4" />
                        </button>

                        {editor.isActive('link') && (
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().unsetLink().run()}
                                className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                                title="Remove Link"
                            >
                                <UnlinkIcon className="size-4" />
                            </button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsImageDialogOpen(true)}
                            className="h-8 gap-1.5 px-2 text-xs font-semibold"
                            title="Insert Image (WordPress / Blogger Media)"
                        >
                            <ImageIcon className="size-3.5" />
                            <span>Add Media</span>
                        </Button>
                    </div>

                    {/* Table Tools */}
                    <div className="flex items-center gap-0.5">
                        <button
                            type="button"
                            onClick={handleInsertTable}
                            className={`p-1.5 rounded transition-colors ${
                                isInsideTable ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                            title="Insert Table Grid"
                        >
                            <TableIcon className="size-4" />
                        </button>

                        {isInsideTable && (
                            <div className="flex items-center gap-0.5 pl-1 border-l border-border">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().addRowAfter().run()}
                                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                    title="Add Row Below"
                                >
                                    <RowsIcon className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                    title="Add Column Right"
                                >
                                    <ColumnsIcon className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().deleteRow().run()}
                                    className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                                    title="Delete Current Row"
                                >
                                    <MinusIcon className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().deleteTable().run()}
                                    className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                                    title="Delete Entire Table"
                                >
                                    <Trash2Icon className="size-3.5" />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ml-auto"
                            title="Clear Formatting"
                        >
                            <RemoveFormattingIcon className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Canvas Area */}
            <div className="relative bg-background">
                {/* 1. VISUAL MODE (WordPress / Blogger Live WYSIWYG) */}
                {viewMode === 'visual' && (
                    <div
                        className="prose-editor-wrapper p-6 focus:outline-none"
                        style={{ minHeight }}
                        onClick={() => {
                            if (editor && !editor.isFocused) {
                                editor.commands.focus();
                            }
                        }}
                    >
                        <EditorContent editor={editor} />
                    </div>
                )}

                {/* 2. HTML MODE (WordPress Text / Blogger HTML View) */}
                {viewMode === 'html' && (
                    <div className="p-4" style={{ minHeight }}>
                        <div className="flex items-center justify-between pb-2 text-[11px] font-mono text-muted-foreground border-b border-border/40 mb-3">
                            <span>HTML Source View (WordPress & Blogger compatible markup)</span>
                            <span className="text-[10px]">Changes synchronize automatically</span>
                        </div>
                        <textarea
                            value={rawHtml}
                            onChange={(e) => {
                                setRawHtml(e.target.value);
                                if (onChange) onChange(e.target.value);
                            }}
                            className="w-full bg-muted/20 text-foreground font-mono text-xs p-4 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-y leading-relaxed"
                            style={{ minHeight: '400px' }}
                            placeholder="<p>Draft HTML tags directly...</p>"
                        />
                    </div>
                )}

                {/* 3. PREVIEW MODE (Live Broadsheet Layout Preview) */}
                {viewMode === 'preview' && (
                    <div className="p-8 max-w-3xl mx-auto space-y-6" style={{ minHeight }}>
                        {/* Broadsheet Lead Header Preview */}
                        <div className="border-b border-border pb-4 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                <span>The Chronicle Broadsheet • Live Preview</span>
                                <span>Reading time: ~{textStats.readingMinutes} min</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                {textStats.words} words • {textStats.characters} characters
                            </div>
                        </div>

                        {/* Rendered Visual Content */}
                        <div
                            className="broadsheet-preview-content prose max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                                __html:
                                    (editor ? editor.getHTML() : rawHtml) ||
                                    '<p class="italic text-muted-foreground">No editorial content drafted yet. Switch to Visual mode to write your story.</p>'
                            }}
                        />

                        <div className="pt-8 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-mono">
                                End of Wire Dispatch
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleSwitchMode('visual')}
                                className="text-xs gap-1.5"
                            >
                                <PencilIcon className="size-3.5" /> Back to Visual Editor
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Status Bar (Classic WordPress Footer Bar) */}
            <div className="flex items-center justify-between border-t border-border bg-muted/25 px-4 py-2 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span className="uppercase font-semibold tracking-wider text-foreground">
                        {viewMode === 'visual' ? 'Visual (WYSIWYG)' : viewMode === 'html' ? 'HTML Source' : 'Broadsheet Reader'}
                    </span>
                    <span className="text-border">|</span>
                    <span>Format: {activeHeadingLevel.toUpperCase()}</span>
                    {isInsideTable && (
                        <>
                            <span className="text-border">|</span>
                            <Badge variant="outline" className="text-[10px] h-4 font-mono">
                                Table Active
                            </Badge>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span>Words: {textStats.words}</span>
                    <span className="text-border">|</span>
                    <span>Characters: {textStats.characters}</span>
                </div>
            </div>

            {/* Hyperlink Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <LinkIcon className="size-4" /> Insert Hyperlink
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Attach a destination web address to the selected text.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveLink} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="link-url" className="text-xs font-semibold">Destination URL *</Label>
                            <Input
                                id="link-url"
                                placeholder="https://example.com/report"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="text-xs"
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="link-new-tab"
                                checked={linkNewTab}
                                onChange={(e) => setLinkNewTab(e.target.checked)}
                                className="rounded border-border"
                            />
                            <Label htmlFor="link-new-tab" className="text-xs text-muted-foreground cursor-pointer">
                                Open link in a new browser tab (`target="_blank"`)
                            </Label>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsLinkDialogOpen(false)}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="text-xs">
                                Apply Link
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Media Insert Dialog (WordPress & Blogger Add Media) */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <ImageIcon className="size-4" /> Add Editorial Photojournalism Asset
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Upload directly via Cloudinary, select from Media Library, or insert an external web image.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Image Caption / Alt Text</Label>
                            <Input
                                placeholder="e.g., Summit delegates confer during afternoon session"
                                value={imageCaption}
                                onChange={(e) => setImageCaption(e.target.value)}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 pt-2">
                            {/* Option 1: Upload from Computer */}
                            <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors text-center">
                                {isUploadingImage ? (
                                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <UploadCloudIcon className="size-6 text-muted-foreground" />
                                )}
                                <div>
                                    <div className="text-xs font-semibold">Upload Photo</div>
                                    <div className="text-[10px] text-muted-foreground">JPG, PNG, WebP via Cloudinary</div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUploadLocalImage}
                                    disabled={isUploadingImage}
                                />
                            </label>

                            {/* Option 2: Select from Media Library */}
                            <button
                                type="button"
                                onClick={() => setIsLibraryDialogOpen(true)}
                                className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors text-center"
                            >
                                <FolderOpenIcon className="size-6 text-muted-foreground" />
                                <div>
                                    <div className="text-xs font-semibold">Media Library</div>
                                    <div className="text-[10px] text-muted-foreground">Browse newsroom archives</div>
                                </div>
                            </button>
                        </div>

                        {/* Option 3: Direct Web Image URL */}
                        <div className="border-t border-border pt-3 space-y-2">
                            <Label className="text-xs font-semibold">Or Embed via Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    className="text-xs flex-1"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleInsertFromUrl}
                                    disabled={!imageUrlInput.trim()}
                                    className="text-xs shrink-0"
                                >
                                    Insert URL
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Media Library Selector Dialog */}
            <MediaLibraryDialog
                open={isLibraryDialogOpen}
                onOpenChange={setIsLibraryDialogOpen}
                onSelect={handleSelectFromLibrary}
                title="Select Photo from Editorial Media Library"
                description="Choose an existing media asset. Role permissions are automatically respected."
            />

            {/* Scoped CSS for TipTap Content and Broadsheet Typography */}
            <style jsx global>{`
                .prose-editor-wrapper .tiptap {
                    outline: none;
                    min-height: 420px;
                    color: inherit;
                    line-height: 1.75;
                    font-size: 0.95rem;
                }

                .prose-editor-wrapper .tiptap p {
                    margin-bottom: 1rem;
                }

                .prose-editor-wrapper .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--muted-foreground);
                    opacity: 0.6;
                    pointer-events: none;
                    height: 0;
                }

                .prose-editor-wrapper .tiptap h1 {
                    font-size: 1.85rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    line-height: 1.25;
                    margin-top: 1.75rem;
                    margin-bottom: 0.75rem;
                    color: var(--foreground);
                }

                .prose-editor-wrapper .tiptap h2 {
                    font-size: 1.45rem;
                    font-weight: 700;
                    letter-spacing: -0.015em;
                    line-height: 1.3;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--foreground);
                }

                .prose-editor-wrapper .tiptap h3 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    line-height: 1.35;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: var(--foreground);
                }

                .prose-editor-wrapper .tiptap h4 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    color: var(--foreground);
                }

                .prose-editor-wrapper .tiptap blockquote {
                    border-left: 3px solid var(--foreground);
                    padding-left: 1.25rem;
                    margin: 1.25rem 0;
                    font-style: italic;
                    color: var(--muted-foreground);
                }

                .prose-editor-wrapper .tiptap ul {
                    list-style-type: disc;
                    padding-left: 1.75rem;
                    margin: 0.75rem 0 1rem;
                }

                .prose-editor-wrapper .tiptap ol {
                    list-style-type: decimal;
                    padding-left: 1.75rem;
                    margin: 0.75rem 0 1rem;
                }

                .prose-editor-wrapper .tiptap li {
                    margin-bottom: 0.35rem;
                }

                .prose-editor-wrapper .tiptap code {
                    font-family: var(--font-mono);
                    font-size: 0.85em;
                    background: var(--muted);
                    padding: 0.15em 0.35em;
                    border-radius: 0.25rem;
                    border: 1px solid var(--border);
                }

                .prose-editor-wrapper .tiptap pre {
                    background: var(--muted);
                    padding: 0.85rem 1rem;
                    border-radius: 0.375rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    border: 1px solid var(--border);
                }

                .prose-editor-wrapper .tiptap hr {
                    border: 0;
                    border-top: 1px solid var(--border);
                    margin: 1.75rem 0;
                }

                .prose-editor-wrapper .tiptap table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.25rem 0;
                    font-size: 0.875rem;
                }

                .prose-editor-wrapper .tiptap th,
                .prose-editor-wrapper .tiptap td {
                    border: 1px solid var(--border);
                    padding: 0.5rem 0.75rem;
                    text-align: left;
                    vertical-align: top;
                }

                .prose-editor-wrapper .tiptap th {
                    background: var(--muted);
                    font-weight: 600;
                }

                .prose-editor-wrapper .tiptap img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.375rem;
                    margin: 1.25rem auto;
                    display: block;
                    border: 1px solid var(--border);
                }

                /* Broadsheet Live Preview Styling */
                .broadsheet-preview-content {
                    font-size: 1.05rem;
                    line-height: 1.85;
                }

                .broadsheet-preview-content p:first-of-type::first-letter {
                    font-size: 3.25rem;
                    font-weight: 700;
                    float: left;
                    line-height: 0.85;
                    margin-right: 0.65rem;
                    margin-top: 0.25rem;
                    color: var(--foreground);
                }

                .broadsheet-preview-content h1,
                .broadsheet-preview-content h2,
                .broadsheet-preview-content h3 {
                    letter-spacing: -0.02em;
                    color: var(--foreground);
                    font-weight: 700;
                }

                .broadsheet-preview-content blockquote {
                    font-style: italic;
                    border-left: 3px solid var(--foreground);
                    padding-left: 1.25rem;
                    margin: 1.5rem 0;
                    color: var(--muted-foreground);
                }

                .broadsheet-preview-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }

                .broadsheet-preview-content th,
                .broadsheet-preview-content td {
                    border: 1px solid var(--border);
                    padding: 0.65rem 0.85rem;
                }

                .broadsheet-preview-content th {
                    background: var(--muted);
                    font-weight: 600;
                }

                .broadsheet-preview-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.375rem;
                    margin: 1.5rem auto;
                    border: 1px solid var(--border);
                }
            `}</style>
        </div>
    );
}
