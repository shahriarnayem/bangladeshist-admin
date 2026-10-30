'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FolderPlusIcon,
  SearchIcon,
  Edit3Icon,
  Trash2Icon,
  RefreshCwIcon,
  CornerDownRightIcon,
  FolderTreeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { buildCategoryTree } from '@/lib/taxonomy';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOrder, setNewOrder] = useState('1');
  const [newParentId, setNewParentId] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editOrder, setEditOrder] = useState('1');
  const [editParentId, setEditParentId] = useState('none');
  const [editIsActive, setEditIsActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {
      toast.error('Failed to load categories from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Compute clean hierarchical tree of categories (parents first, children nested beneath)
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  // Auto-generate slug from name in Create
  const handleNameChange = (val) => {
    setNewName(val);
    setNewSlug(
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
    );
  };

  // Create Category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName.trim(),
          slug: newSlug.trim() || undefined,
          description: newDesc.trim() || undefined,
          order: Number(newOrder) || categories.length + 1,
          parentId: newParentId === 'none' ? null : newParentId,
          isActive: true
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Category "${data.category.name}" created`);
        setCreateDialogOpen(false);
        setNewName('');
        setNewSlug('');
        setNewDesc('');
        setNewParentId('none');
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to create category');
      }
    } catch {
      toast.error('Network error creating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDesc(cat.description || '');
    setEditOrder(String(cat.order || '1'));
    setEditParentId(cat.parentId || 'none');
    setEditIsActive(cat.isActive ?? true);
    setEditDialogOpen(true);
  };

  // Update Category (PUT /api/categories/[id])
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug.trim(),
          description: editDesc.trim() || null,
          order: Number(editOrder) || 0,
          parentId: editParentId === 'none' ? null : editParentId,
          isActive: editIsActive
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Category "${data.category.name}" updated successfully`);
        setEditDialogOpen(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to update category');
      }
    } catch {
      toast.error('Network error updating category');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Category
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Category "${name}" removed`);
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch {
      toast.error('Error deleting category');
    }
  };

  // Filter the hierarchical tree: if search is present, match name, slug, desc, or parent name
  const displayCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categoryTree;

    return categoryTree.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.parentName && c.parentName.toLowerCase().includes(q))
    );
  }, [categoryTree, search]);

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight'>Editorial Desks & Categories</h1>
            <Badge variant='outline' className='font-mono text-xs uppercase'>
              {categories.length} BEATS
            </Badge>
          </div>
          <p className='text-muted-foreground text-sm'>
            Hierarchical broadsheet taxonomy. Subcategories nest directly beneath their parent desks.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={fetchCategories} className='gap-1.5 text-xs'>
            <RefreshCwIcon className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size='sm'
            onClick={() => {
              setNewParentId('none');
              setCreateDialogOpen(true);
            }}
            className='gap-1.5 text-xs font-medium'
          >
            <FolderPlusIcon className='size-3.5' /> Add Category Beat
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className='flex items-center justify-between gap-4'>
        <div className='relative max-w-sm w-full'>
          <SearchIcon className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search categories by name, parent desk, or slug...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8 text-xs h-8'
          />
        </div>
      </div>

      {/* Categories Table: Hierarchical layout with child categories beneath parent */}
      <Card className='border'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='text-xs bg-muted/20'>
                <TableHead className='w-16 text-center'>Order</TableHead>
                <TableHead>Beat Name & Scope (Hierarchical)</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead className='font-mono'>Permalink Slug</TableHead>
                <TableHead className='text-right'>Articles</TableHead>
                <TableHead className='w-24 text-center'>Status</TableHead>
                <TableHead className='w-28 text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-xs text-muted-foreground'>
                    Loading categories from MongoDB...
                  </TableCell>
                </TableRow>
              ) : displayCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-xs text-muted-foreground'>
                    No categories found matching your query.
                  </TableCell>
                </TableRow>
              ) : (
                displayCategories.map((cat, idx) => {
                  const isChild = cat.depth > 0;
                  return (
                    <TableRow
                      key={cat.id}
                      className={`text-xs transition-colors ${
                        isChild
                          ? 'bg-muted/10 hover:bg-muted/30 border-l-2 border-l-muted-foreground/30'
                          : 'hover:bg-muted/20 font-medium'
                      }`}
                    >
                      <TableCell className='text-center font-mono text-muted-foreground'>
                        {cat.order || idx + 1}
                      </TableCell>

                      {/* Name Column: Indented under parent with visual branch icon */}
                      <TableCell>
                        <div
                          className='flex items-center gap-1.5'
                          style={{ paddingLeft: isChild ? `${cat.depth * 20}px` : '0px' }}
                        >
                          {isChild ? (
                            <CornerDownRightIcon className='size-3.5 text-muted-foreground shrink-0' />
                          ) : (
                            <FolderTreeIcon className='size-3.5 text-foreground/70 shrink-0' />
                          )}
                          <span
                            className={
                              isChild
                                ? 'text-foreground/90 font-normal'
                                : 'font-semibold text-foreground text-[13px]'
                            }
                          >
                            {cat.name}
                          </span>
                          {!isChild && cat.childCount > 0 && (
                            <Badge
                              variant='secondary'
                              className='text-[9px] font-mono px-1 py-0 ml-1.5 bg-muted text-muted-foreground'
                            >
                              {cat.childCount} {cat.childCount === 1 ? 'sub-beat' : 'sub-beats'}
                            </Badge>
                          )}
                        </div>
                        {cat.description && (
                          <p
                            className='text-[11px] text-muted-foreground line-clamp-1 mt-0.5'
                            style={{ paddingLeft: isChild ? `${cat.depth * 20 + 20}px` : '20px' }}
                          >
                            {cat.description}
                          </p>
                        )}
                      </TableCell>

                      {/* Parent Category Column */}
                      <TableCell>
                        {cat.parentName ? (
                          <Badge variant='outline' className='text-[10px] font-medium gap-1 text-foreground/80 bg-background'>
                            <FolderTreeIcon className='size-2.5 text-muted-foreground' />
                            {cat.parentName}
                          </Badge>
                        ) : (
                          <span className='text-[10px] text-muted-foreground/50 font-mono italic'>
                            — Root Desk —
                          </span>
                        )}
                      </TableCell>

                      <TableCell className='font-mono text-muted-foreground text-[11px]'>
                        /category/{cat.slug}
                      </TableCell>

                      <TableCell className='text-right font-mono font-semibold'>
                        {cat._count?.articles ?? 0}
                      </TableCell>

                      <TableCell className='text-center'>
                        <Badge
                          variant='outline'
                          className={`text-[9px] font-mono px-1.5 py-0.2 ${
                            cat.isActive !== false ? 'border-foreground/40 text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {cat.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </TableCell>

                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-7 text-muted-foreground hover:text-foreground'
                            onClick={() => openEditDialog(cat)}
                            title='Edit Category Beat'
                          >
                            <Edit3Icon className='size-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-7 text-destructive hover:bg-destructive/10'
                            onClick={() => handleDelete(cat.id, cat.name)}
                            title='Delete Category Beat'
                          >
                            <Trash2Icon className='size-3.5' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-semibold'>Create Editorial Beat</DialogTitle>
            <DialogDescription className='text-xs'>
              Define a new reporting section or subcategory for story categorization and menus.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className='space-y-4 py-2'>
            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Category Name *</Label>
              <Input
                placeholder='e.g. Geopolitics & Foreign Affairs'
                value={newName}
                onChange={(e) => handleNameChange(e.target.value)}
                className='text-xs'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Parent Category</Label>
              <Select
                value={newParentId}
                onValueChange={(val) => {
                  if (val) setNewParentId(val);
                }}
              >
                <SelectTrigger className='w-full text-xs font-medium'>
                  <SelectValue placeholder='None (Top-Level Category)' />
                </SelectTrigger>
                <SelectContent className='max-h-60'>
                  <SelectItem value='none'>None (Top-Level Category)</SelectItem>
                  {categoryTree.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className={c.depth > 0 ? 'pl-6 text-muted-foreground' : 'font-semibold'}
                    >
                      {c.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-[10px] text-muted-foreground'>
                Choose a parent category to create a sub-desk, or leave as None for top-level.
              </p>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>URL Permalink Slug</Label>
              <Input
                placeholder='e.g. geopolitics-foreign-affairs'
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className='font-mono text-xs'
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Scope / Editorial Summary</Label>
              <Input
                placeholder='Coverage scope and editorial remit...'
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className='text-xs'
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Display Order Weight</Label>
              <Input
                type='number'
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
                className='font-mono text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button type='button' variant='outline' size='sm' onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' size='sm' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Beat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-semibold'>Edit Editorial Beat</DialogTitle>
            <DialogDescription className='text-xs'>
              Modify beat title, parent category hierarchy, URL permalink, description, and status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className='space-y-4 py-2'>
            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Category Name *</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className='text-xs font-semibold'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Parent Category</Label>
              <Select
                value={editParentId}
                onValueChange={(val) => {
                  if (val) setEditParentId(val);
                }}
              >
                <SelectTrigger className='w-full text-xs font-medium'>
                  <SelectValue placeholder='None (Top-Level Category)' />
                </SelectTrigger>
                <SelectContent className='max-h-60'>
                  <SelectItem value='none'>None (Top-Level Category)</SelectItem>
                  {categoryTree
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className={c.depth > 0 ? 'pl-6 text-muted-foreground' : 'font-semibold'}
                      >
                        {c.displayName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className='text-[10px] text-muted-foreground'>
                Assign to another category to nest this as a sub-beat, or select None for root.
              </p>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>URL Permalink Slug</Label>
              <Input
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className='font-mono text-xs'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold'>Editorial Scope / Description</Label>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className='text-xs'
                placeholder='Scope description...'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Display Order Weight</Label>
                <Input
                  type='number'
                  value={editOrder}
                  onChange={(e) => setEditOrder(e.target.value)}
                  className='font-mono text-xs'
                />
              </div>
              <div className='space-y-1.5 flex flex-col justify-end'>
                <div className='flex items-center justify-between border rounded-md p-2 h-9'>
                  <span className='text-xs font-medium'>Active Status</span>
                  <Switch checked={editIsActive} onCheckedChange={setEditIsActive} />
                </div>
              </div>
            </div>

            <DialogFooter className='pt-2'>
              <Button type='button' variant='outline' size='sm' onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' size='sm' disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
