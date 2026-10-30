'use client';

import { useState, useMemo } from 'react';
import {
    Plus,
    Check,
    FolderTree,
    X,
    ChevronDown,
    ChevronUp,
    Star,
    Loader2,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

/**
 * Builds a hierarchical list with parent categories followed immediately by their children (depth: 1)
 */
export function buildCategoryTree(categories) {
    if (!categories || !categories.length) return [];
    const parents = categories.filter((c) => !c.parentId);
    const children = categories.filter((c) => c.parentId);

    const result = [];
    parents.forEach((parent) => {
        result.push({ ...parent, depth: 0 });
        const parentChildren = children.filter((c) => c.parentId === parent.id);
        parentChildren.forEach((child) => {
            result.push({ ...child, depth: 1, parentName: parent.name });
        });
    });

    // Include any categories that might have an unrecognized parent
    children.forEach((child) => {
        if (!result.some((r) => r.id === child.id)) {
            result.push({ ...child, depth: 1 });
        }
    });

    return result;
}

/**
 * CategoryMultiSelector Component
 * Allows selecting multiple categories, designating a primary category,
 * and creating new categories inline without leaving the article editor.
 */
export function CategoryMultiSelector({
    categories = [],
    selectedIds = [],
    primaryId = '',
    onChange,
    onCategoryCreated
}) {
    // Search query for filtering categories
    const [searchQuery, setSearchQuery] = useState('');

    // Inline "Add New Category" form state
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newParentId, setNewParentId] = useState('none');
    const [isCreating, setIsCreating] = useState(false);

    // Build hierarchical tree
    const categoryTree = useMemo(() => {
        return buildCategoryTree(categories);
    }, [categories]);

    // Filter categories based on search query
    const filteredTree = useMemo(() => {
        if (!searchQuery.trim()) return categoryTree;
        const q = searchQuery.toLowerCase();
        return categoryTree.filter((c) =>
            c.name.toLowerCase().includes(q) ||
            (c.parentName && c.parentName.toLowerCase().includes(q))
        );
    }, [categoryTree, searchQuery]);

    // Toggle category selection
    const handleToggleCategory = (catId) => {
        const isSelected = selectedIds.includes(catId);
        let newSelected = [];
        let newPrimary = primaryId;

        if (isSelected) {
            newSelected = selectedIds.filter((id) => id !== catId);
            // If the primary was unselected, switch primary to the first remaining
            if (newPrimary === catId) {
                newPrimary = newSelected.length > 0 ? newSelected[0] : '';
            }
        } else {
            newSelected = [...selectedIds, catId];
            // If no primary was set, set this one as primary
            if (!newPrimary) {
                newPrimary = catId;
            }
        }

        if (onChange) {
            onChange({
                categoryIds: newSelected,
                primaryId: newPrimary
            });
        }
    };

    // Set a selected category as primary
    const handleSetPrimary = (e, catId) => {
        e.stopPropagation();
        if (!selectedIds.includes(catId)) {
            const newSelected = [...selectedIds, catId];
            if (onChange) {
                onChange({
                    categoryIds: newSelected,
                    primaryId: catId
                });
            }
        } else {
            if (onChange) {
                onChange({
                    categoryIds: selectedIds,
                    primaryId: catId
                });
            }
        }
    };

    // Remove category from selection
    const handleRemoveCategory = (catId) => {
        const newSelected = selectedIds.filter((id) => id !== catId);
        let newPrimary = primaryId;
        if (newPrimary === catId) {
            newPrimary = newSelected.length > 0 ? newSelected[0] : '';
        }
        if (onChange) {
            onChange({
                categoryIds: newSelected,
                primaryId: newPrimary
            });
        }
    };

    // Handle inline quick create
    const handleCreateCategory = async (e) => {
        if (e) e.preventDefault();
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            toast.error('Category name is required');
            return;
        }

        try {
            setIsCreating(true);
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: trimmedName,
                    parentId: newParentId === 'none' ? null : newParentId
                })
            });

            const data = await res.json();
            if (data.success && data.category) {
                const newCat = data.category;
                toast.success(`Category "${newCat.name}" created and selected!`);

                // Inform parent component to append to categories list
                if (onCategoryCreated) {
                    onCategoryCreated(newCat);
                }

                // Automatically add to selection and set as primary if none
                const newSelected = [...selectedIds, newCat.id];
                const newPrimary = primaryId || newCat.id;

                if (onChange) {
                    onChange({
                        categoryIds: newSelected,
                        primaryId: newPrimary
                    });
                }

                // Reset form
                setNewCategoryName('');
                setNewParentId('none');
                setIsAddingNew(false);
            } else {
                toast.error(data.error || 'Failed to create category');
            }
        } catch {
            toast.error('Network error creating category');
        } finally {
            setIsCreating(false);
        }
    };

    // Find category details for badges
    const selectedCategoriesList = useMemo(() => {
        return selectedIds.map((id) => {
            const match = categories.find((c) => c.id === id);
            return match || { id, name: id };
        });
    }, [selectedIds, categories]);

    return (
        <div className="space-y-3">
            {/* Selected Categories Badges (Summary) */}
            {selectedCategoriesList.length > 0 && (
                <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                        <span>Selected Desks ({selectedCategoriesList.length})</span>
                        <span className="text-[10px] text-muted-foreground">★ = Primary Lead Desk</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-md border bg-muted/20 min-h-9">
                        {selectedCategoriesList.map((cat) => {
                            const isPrimary = cat.id === primaryId;
                            return (
                                <Badge
                                    key={cat.id}
                                    variant={isPrimary ? 'default' : 'secondary'}
                                    className="text-xs py-0.5 pl-2 pr-1 gap-1.5 font-medium transition-all"
                                >
                                    <span className="flex items-center gap-1">
                                        {isPrimary && <Star className="size-3 fill-current" />}
                                        {cat.name}
                                    </span>

                                    {!isPrimary && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleSetPrimary(e, cat.id)}
                                            className="text-[9px] underline opacity-70 hover:opacity-100 mr-1"
                                            title="Set as primary desk"
                                        >
                                            Make Primary
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(cat.id)}
                                        className="rounded-full hover:bg-background/20 p-0.5"
                                        title="Remove category"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filter Search Input */}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search or filter categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-card"
                />
            </div>

            {/* Scrollable Categories Checklist (WordPress / Blogger style) */}
            <div className="max-h-52 overflow-y-auto rounded-md border bg-card divide-y p-1 text-xs">
                {filteredTree.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                        {searchQuery ? 'No matching categories found.' : 'No categories available.'}
                    </div>
                ) : (
                    filteredTree.map((c) => {
                        const isSelected = selectedIds.includes(c.id);
                        const isPrimary = c.id === primaryId;

                        return (
                            <div
                                key={c.id}
                                onClick={() => handleToggleCategory(c.id)}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:bg-muted/40 select-none ${
                                    isSelected ? 'bg-muted/20 font-medium' : ''
                                }`}
                                style={{ paddingLeft: c.depth > 0 ? '1.5rem' : '0.5rem' }}
                            >
                                <div className="flex items-center gap-2">
                                    {/* Custom Checkbox */}
                                    <div
                                        className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                            isSelected ? 'bg-foreground text-background border-foreground' : 'border-muted-foreground/40 bg-background'
                                        }`}
                                    >
                                        {isSelected && <Check className="size-3 stroke-[2.5]" />}
                                    </div>

                                    {/* Category Name & Hierarchy Indent */}
                                    <span className={c.depth === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground font-normal'}>
                                        {c.depth > 0 ? `↳ ${c.name}` : c.name}
                                    </span>
                                </div>

                                {/* Primary Toggle Button */}
                                {isSelected && (
                                    <div className="flex items-center gap-1">
                                        {isPrimary ? (
                                            <Badge variant="outline" className="font-mono text-[9px] px-1 py-0 gap-1 bg-foreground text-background">
                                                <Star className="size-2.5 fill-current" /> Primary
                                            </Badge>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                                                onClick={(e) => handleSetPrimary(e, c.id)}
                                            >
                                                Make Primary
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Inline "Add New Category" Section (WordPress style) */}
            <div className="border-t pt-2">
                {!isAddingNew ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingNew(true)}
                        className="text-xs h-8 text-foreground gap-1.5 px-2 hover:bg-muted font-medium w-full justify-start"
                    >
                        <Plus className="size-3.5" /> + Add New Category
                    </Button>
                ) : (
                    <div className="p-3 rounded-lg border bg-muted/20 space-y-3 animate-in fade-in-50 duration-150">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                                <FolderTree className="size-3.5" /> Add New Category Beat
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="size-6 p-0"
                                onClick={() => setIsAddingNew(false)}
                            >
                                <X className="size-3.5" />
                            </Button>
                        </div>

                        {/* Category Name */}
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Category Name *</Label>
                            <Input
                                placeholder="e.g. Foreign Policy, Markets..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="h-8 text-xs bg-background"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCreateCategory();
                                    }
                                }}
                                autoFocus
                            />
                        </div>

                        {/* Parent Category Selector */}
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold">Parent Category (Optional)</Label>
                            <Select value={newParentId} onValueChange={setNewParentId}>
                                <SelectTrigger className="h-8 text-xs bg-background">
                                    <SelectValue placeholder="Select Parent Beat" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    <SelectItem value="none" className="text-xs font-semibold">
                                        — None (Top-Level Parent) —
                                    </SelectItem>
                                    {categoryTree.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={c.id}
                                            className={c.depth > 0 ? 'pl-6 text-muted-foreground text-xs' : 'font-semibold text-xs'}
                                        >
                                            {c.depth > 0 ? `— ${c.name}` : c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit & Cancel Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleCreateCategory}
                                disabled={isCreating || !newCategoryName.trim()}
                                className="text-xs h-7 gap-1 font-medium flex-1"
                            >
                                {isCreating ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                                Add Category
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingNew(false)}
                                className="text-xs h-7"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
