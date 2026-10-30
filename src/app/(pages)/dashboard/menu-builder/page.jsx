'use client';
import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, Trash2Icon, SaveIcon, MoveUpIcon, MoveDownIcon, RefreshCwIcon, FileTextIcon, FileIcon, FolderTreeIcon, TagIcon, Link2Icon, EyeIcon, CornerDownRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildCategoryTree } from '@/lib/taxonomy';
export default function MenuBuilderPage() {
    const [menus, setMenus] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Current Menu Form State
    const [menuName, setMenuName] = useState('');
    const [menuLocation, setMenuLocation] = useState('HEADER');
    const [menuItems, setMenuItems] = useState([]);
    // Available Resources from Database
    const [availablePages, setAvailablePages] = useState([]);
    const [availableArticles, setAvailableArticles] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    // Selection Checkboxes
    const [selectedPages, setSelectedPages] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    // Custom Link Inputs
    const [customUrl, setCustomUrl] = useState('');
    const [customLabel, setCustomLabel] = useState('');
    // Search in articles
    const [articleSearch, setArticleSearch] = useState('');

    const hierarchicalCategories = useMemo(() => {
        return buildCategoryTree(availableCategories);
    }, [availableCategories]);
    // Load Resources and Existing Menus
    const loadInitialData = async ()=>{
        setLoading(true);
        try {
            const [menusRes, pagesRes, articlesRes, catsRes, tagsRes] = await Promise.all([
                fetch('/api/menus'),
                fetch('/api/pages'),
                fetch('/api/articles?limit=30'),
                fetch('/api/categories'),
                fetch('/api/tags')
            ]);
            if (menusRes.ok) {
                const mData = await menusRes.json();
                if (mData.success && mData.menus) {
                    setMenus(mData.menus);
                    if (mData.menus.length > 0 && !selectedMenuId) {
                        selectMenu(mData.menus[0]);
                    }
                }
            }
            if (pagesRes.ok) {
                const pData = await pagesRes.json();
                if (pData.success && pData.pages) setAvailablePages(pData.pages);
            }
            if (articlesRes.ok) {
                const aData = await articlesRes.json();
                if (aData.success && aData.articles) setAvailableArticles(aData.articles);
            }
            if (catsRes.ok) {
                const cData = await catsRes.json();
                if (cData.success && cData.categories) setAvailableCategories(cData.categories);
            }
            if (tagsRes.ok) {
                const tData = await tagsRes.json();
                if (tData.success && tData.tags) setAvailableTags(tData.tags);
            }
        } catch  {
            toast.error('Network error loading menu data');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        loadInitialData();
    }, []);
    const selectMenu = (menu)=>{
        setSelectedMenuId(menu.id);
        setMenuName(menu.name);
        setMenuLocation(menu.location || 'HEADER');
        setMenuItems(menu.items || []);
    };
    const handleCreateNewMenu = ()=>{
        setSelectedMenuId('new');
        setMenuName('New Custom Menu');
        setMenuLocation('HEADER');
        setMenuItems([]);
    };
    // --- Add to Menu Handlers ---
    const addPagesToMenu = ()=>{
        const toAdd = availablePages.filter((p1)=>selectedPages.includes(p1.id)).map((p1)=>({
                id: `page-${p1.id}-${Date.now()}`,
                label: p1.title,
                url: `/${p1.slug}`,
                type: 'Page'
            }));
        if (toAdd.length === 0) {
            toast.error('Please select at least one page');
            return;
        }
        setMenuItems((prev)=>[
                ...prev,
                ...toAdd
            ]);
        setSelectedPages([]);
        toast.success(`Added ${toAdd.length} page(s) to menu`);
    };
    const addArticlesToMenu = ()=>{
        const toAdd = availableArticles.filter((a)=>selectedArticles.includes(a.id)).map((a)=>({
                id: `article-${a.id}-${Date.now()}`,
                label: a.title,
                url: `/${a.slug}`,
                type: 'Article'
            }));
        if (toAdd.length === 0) {
            toast.error('Please select at least one article');
            return;
        }
        setMenuItems((prev)=>[
                ...prev,
                ...toAdd
            ]);
        setSelectedArticles([]);
        toast.success(`Added ${toAdd.length} article(s) to menu`);
    };
    const addCategoriesToMenu = ()=>{
        const toAdd = availableCategories.filter((c)=>selectedCategories.includes(c.id)).map((c)=>({
                id: `cat-${c.id}-${Date.now()}`,
                label: c.name,
                url: `/category/${c.slug}`,
                type: 'Category'
            }));
        if (toAdd.length === 0) {
            toast.error('Please select at least one category');
            return;
        }
        setMenuItems((prev)=>[
                ...prev,
                ...toAdd
            ]);
        setSelectedCategories([]);
        toast.success(`Added ${toAdd.length} category beat(s) to menu`);
    };
    const addTagsToMenu = ()=>{
        const toAdd = availableTags.filter((t)=>selectedTags.includes(t.id)).map((t)=>({
                id: `tag-${t.id}-${Date.now()}`,
                label: t.name,
                url: `/tag/${t.slug}`,
                type: 'Tag'
            }));
        if (toAdd.length === 0) {
            toast.error('Please select at least one tag');
            return;
        }
        setMenuItems((prev)=>[
                ...prev,
                ...toAdd
            ]);
        setSelectedTags([]);
        toast.success(`Added ${toAdd.length} tag(s) to menu`);
    };
    const addCustomLinkToMenu = ()=>{
        if (!customUrl.trim() || !customLabel.trim()) {
            toast.error('Please enter both URL and Link Text');
            return;
        }
        const newItem = {
            id: `custom-${Date.now()}`,
            label: customLabel.trim(),
            url: customUrl.trim(),
            type: 'Custom',
            isExternal: customUrl.startsWith('http')
        };
        setMenuItems((prev)=>[
                ...prev,
                newItem
            ]);
        setCustomUrl('');
        setCustomLabel('');
        toast.success('Custom link added to menu');
    };
    // --- Menu Item Manipulation ---
    const moveItem = (index, direction)=>{
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= menuItems.length) return;
        const updated = [
            ...menuItems
        ];
        const temp = updated[index];
        updated[index] = updated[target];
        updated[target] = temp;
        setMenuItems(updated);
    };
    const toggleSubItem = (index)=>{
        const updated = [
            ...menuItems
        ];
        updated[index] = {
            ...updated[index],
            isSubItem: !updated[index].isSubItem
        };
        setMenuItems(updated);
    };
    const updateItemLabel = (index, newLabel)=>{
        const updated = [
            ...menuItems
        ];
        updated[index] = {
            ...updated[index],
            label: newLabel
        };
        setMenuItems(updated);
    };
    const removeItem = (index)=>{
        setMenuItems((prev)=>prev.filter((_, i)=>i !== index));
    };
    // --- Save / Delete Menu ---
    const handleSaveMenu = async ()=>{
        if (!menuName.trim()) {
            toast.error('Menu Name is required');
            return;
        }
        try {
            setIsSaving(true);
            const res = await fetch('/api/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedMenuId !== 'new' ? selectedMenuId : undefined,
                    name: menuName.trim(),
                    location: menuLocation,
                    items: menuItems
                })
            });
            const data = await res.json();
            if (data.success && data.menu) {
                toast.success(`Menu "${data.menu.name}" saved to MongoDB`);
                loadInitialData();
            } else {
                toast.error(data.error || 'Failed to save menu');
            }
        } catch  {
            toast.error('Network error saving menu');
        } finally{
            setIsSaving(false);
        }
    };
    const handleDeleteMenu = async ()=>{
        if (selectedMenuId === 'new') return;
        if (!confirm(`Permanently delete menu "${menuName}"?`)) return;
        try {
            const res = await fetch(`/api/menus/${selectedMenuId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Menu deleted');
                setSelectedMenuId('');
                loadInitialData();
            } else {
                toast.error(data.error || 'Failed to delete menu');
            }
        } catch  {
            toast.error('Network error deleting menu');
        }
    };
    return <div className="space-y-6 pb-12">
      { /* Top Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Navigation Menu Builder</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              WordPress Engine
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Construct navigation menus by selecting static pages, articles, category beats, tags, or custom URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedMenuId && selectedMenuId !== 'new' && <Button variant="outline" size="sm" onClick={handleDeleteMenu} className="text-xs text-destructive hover:bg-destructive/10">
              <Trash2Icon className="mr-1 size-3.5"/> Delete Menu
            </Button>}

          <Button size="sm" onClick={handleSaveMenu} disabled={isSaving} className="text-xs gap-1.5 font-medium">
            {isSaving ? <RefreshCwIcon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
            Save Menu
          </Button>
        </div>
      </div>

      { /* Menu Selector Strip */ }
      <Card className="border bg-muted/20">
        <CardContent className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-foreground whitespace-nowrap">Select a menu to edit:</span>
            <Select value={selectedMenuId} onValueChange={(val)=>{
        if (val === 'new') {
            handleCreateNewMenu();
        } else if (val) {
            const target = menus.find((m)=>m.id === val);
            if (target) selectMenu(target);
        }
    }}>
              <SelectTrigger className="text-xs h-8 bg-background min-w-[220px]">
                <SelectValue placeholder="Choose Menu"/>
              </SelectTrigger>
              <SelectContent>
                {menus.map((m)=><SelectItem key={m.id} value={m.id} className="text-xs">
                    {m.name} ({m.location})
                  </SelectItem>)}
                <SelectItem value="new" className="text-xs font-semibold text-foreground border-t">
                  + Create a New Menu
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="sm" onClick={handleCreateNewMenu} className="text-xs h-7 text-foreground font-medium">
            <PlusIcon className="mr-1 size-3.5"/> Create New Menu
          </Button>
        </CardContent>
      </Card>

      { /* Live Menu Broadsheet Preview */ }
      <Card className="border shadow-xs overflow-hidden">
        <CardHeader className="py-2.5 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon className="size-3.5 text-muted-foreground"/>
            <span className="text-xs font-semibold uppercase tracking-wider">Live Navigation Bar Preview</span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {menuLocation} DISPLAY
          </Badge>
        </CardHeader>
        <CardContent className="p-3 bg-card flex flex-wrap items-center gap-6 text-xs font-medium uppercase tracking-wider justify-center">
          {menuItems.length === 0 ? <span className="text-muted-foreground text-xs normal-case italic py-2">
              Menu is empty. Select items from the left panel to populate this menu.
            </span> : menuItems.map((item, idx)=><span key={idx} className={`hover:underline cursor-pointer ${item.isSubItem ? 'text-muted-foreground text-[11px] lowercase pl-1' : 'text-foreground'}`}>
                {item.isSubItem && '↳ '}
                {item.label}
              </span>)}
        </CardContent>
      </Card>

      { /* Main 2-Column WordPress Layout */ }
      <div className="grid gap-6 lg:grid-cols-12">
        { /* Left Column: Add Menu Items (Accordion / Tabs) (5 cols) */ }
        <div className="space-y-4 lg:col-span-5">
          <Card className="border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold">Add Menu Items</CardTitle>
              <CardDescription className="text-xs">
                Select content from your database to insert into the navigation tree.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="pages" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 p-1 flex-wrap h-auto gap-1">
                  <TabsTrigger value="pages" className="text-xs h-7 gap-1">
                    <FileIcon className="size-3"/> Pages
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="text-xs h-7 gap-1">
                    <FileTextIcon className="size-3"/> Articles
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="text-xs h-7 gap-1">
                    <FolderTreeIcon className="size-3"/> Categories
                  </TabsTrigger>
                  <TabsTrigger value="tags" className="text-xs h-7 gap-1">
                    <TagIcon className="size-3"/> Tags
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs h-7 gap-1">
                    <Link2Icon className="size-3"/> Custom
                  </TabsTrigger>
                </TabsList>

                { /* Tab 1: Static Pages */ }
                <TabsContent value="pages" className="p-4 space-y-3 m-0">
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2 bg-muted/10 text-xs">
                    {availablePages.length === 0 ? <p className="text-muted-foreground text-xs py-2 text-center">No static pages found.</p> : availablePages.map((page)=><label key={page.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/40 cursor-pointer">
                          <input type="checkbox" checked={selectedPages.includes(page.id)} onChange={(e)=>{
            if (e.target.checked) setSelectedPages((prev)=>[
                    ...prev,
                    page.id
                ]);
            else setSelectedPages((prev)=>prev.filter((id)=>id !== page.id));
        }} className="rounded border-muted"/>
                          <span className="font-medium text-foreground">{page.title}</span>
                          <span className="font-mono text-[10px] text-muted-foreground ml-auto">/{page.slug}</span>
                        </label>)}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addPagesToMenu} disabled={selectedPages.length === 0} className="w-full text-xs h-8">
                    Add Selected Pages to Menu
                  </Button>
                </TabsContent>

                { /* Tab 2: Articles / Posts */ }
                <TabsContent value="articles" className="p-4 space-y-3 m-0">
                  <Input placeholder="Search articles..." value={articleSearch} onChange={(e)=>setArticleSearch(e.target.value)} className="text-xs h-7"/>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2 bg-muted/10 text-xs">
                    {availableArticles.filter((a)=>a.title.toLowerCase().includes(articleSearch.toLowerCase())).map((article)=><label key={article.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/40 cursor-pointer">
                          <input type="checkbox" checked={selectedArticles.includes(article.id)} onChange={(e)=>{
            if (e.target.checked) setSelectedArticles((prev)=>[
                    ...prev,
                    article.id
                ]);
            else setSelectedArticles((prev)=>prev.filter((id)=>id !== article.id));
        }} className="rounded border-muted"/>
                          <span className="font-medium text-foreground truncate max-w-[200px]" title={article.title}>
                            {article.title}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground ml-auto">/{article.slug}</span>
                        </label>)}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addArticlesToMenu} disabled={selectedArticles.length === 0} className="w-full text-xs h-8">
                    Add Selected Articles to Menu
                  </Button>
                </TabsContent>

                { /* Tab 3: Categories */ }
                <TabsContent value="categories" className="p-4 space-y-3 m-0">
                  <div className="max-h-56 overflow-y-auto space-y-1.5 border rounded-md p-2 bg-muted/10 text-xs">
                    {hierarchicalCategories.map((cat)=><label
                        key={cat.id}
                        className="flex items-center gap-2 p-1 rounded hover:bg-muted/40 cursor-pointer text-xs"
                        style={{ paddingLeft: cat.depth > 0 ? `${cat.depth * 18 + 4}px` : '4px' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={(e)=>{
                            if (e.target.checked) setSelectedCategories((prev)=>[...prev, cat.id]);
                            else setSelectedCategories((prev)=>prev.filter((id)=>id !== cat.id));
                          }}
                          className="rounded border-muted"
                        />
                        {cat.depth > 0 && <CornerDownRightIcon className="size-3 text-muted-foreground shrink-0"/>}
                        <span className={`truncate max-w-[200px] ${cat.depth > 0 ? 'text-muted-foreground font-normal' : 'font-semibold text-foreground'}`}>
                          {cat.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-auto">/category/{cat.slug}</span>
                      </label>)}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addCategoriesToMenu} disabled={selectedCategories.length === 0} className="w-full text-xs h-8">
                    Add Selected Categories to Menu
                  </Button>
                </TabsContent>

                { /* Tab 4: Tags */ }
                <TabsContent value="tags" className="p-4 space-y-3 m-0">
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2 bg-muted/10 text-xs">
                    {availableTags.slice(0, 40).map((tag)=><label key={tag.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/40 cursor-pointer">
                        <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={(e)=>{
            if (e.target.checked) setSelectedTags((prev)=>[
                    ...prev,
                    tag.id
                ]);
            else setSelectedTags((prev)=>prev.filter((id)=>id !== tag.id));
        }} className="rounded border-muted"/>
                        <span className="font-medium text-foreground">{tag.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-auto">/tag/{tag.slug}</span>
                      </label>)}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addTagsToMenu} disabled={selectedTags.length === 0} className="w-full text-xs h-8">
                    Add Selected Tags to Menu
                  </Button>
                </TabsContent>

                { /* Tab 5: Custom Links */ }
                <TabsContent value="custom" className="p-4 space-y-3 m-0">
                  <div className="space-y-1.5">
                    <Label className="text-xs">URL Endpoint *</Label>
                    <Input placeholder="https://... or /custom-page" value={customUrl} onChange={(e)=>setCustomUrl(e.target.value)} className="text-xs font-mono"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Link Navigation Text *</Label>
                    <Input placeholder="e.g. Special Investigations" value={customLabel} onChange={(e)=>setCustomLabel(e.target.value)} className="text-xs"/>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addCustomLinkToMenu} className="w-full text-xs h-8">
                    Add Custom Link to Menu
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        { /* Right Column: Menu Structure & Item Tree (7 cols) */ }
        <div className="space-y-4 lg:col-span-7">
          <Card className="border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold">Menu Structure</CardTitle>
              <CardDescription className="text-xs">
                Reorder, rename, or indent links to create dropdown sub-items.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              { /* Menu Meta */ }
              <div className="grid gap-3 sm:grid-cols-2 pb-3 border-b">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Menu Name *</Label>
                  <Input value={menuName} onChange={(e)=>setMenuName(e.target.value)} placeholder="e.g. Primary Header Navigation" className="text-xs h-8"/>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Display Theme Location</Label>
                  <Select value={menuLocation} onValueChange={(val)=>{
        if (val) setMenuLocation(val);
    }}>
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HEADER">Primary Header Broadsheet</SelectItem>
                      <SelectItem value="FOOTER">Institutional Footer Base</SelectItem>
                      <SelectItem value="MOBILE">Mobile Drawer Navigation</SelectItem>
                      <SelectItem value="TOPBAR">Top Utility Ribbon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              { /* Items List */ }
              <div className="space-y-2">
                {menuItems.length === 0 ? <div className="p-8 text-center border-2 border-dashed rounded-lg text-xs text-muted-foreground">
                    This menu has no items yet. Select pages, articles, categories, or add custom links from the left panel.
                  </div> : menuItems.map((item, idx)=><div key={item.id} className={`p-2.5 rounded-md border bg-card transition-all flex items-center justify-between gap-3 text-xs ${item.isSubItem ? 'ml-6 border-l-4 border-l-foreground/60 bg-muted/20' : ''}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-mono text-muted-foreground text-[10px] w-4 text-center">
                          {idx + 1}
                        </span>
                        {item.isSubItem && <CornerDownRightIcon className="size-3 text-muted-foreground shrink-0"/>}
                        <Input value={item.label} onChange={(e)=>updateItemLabel(idx, e.target.value)} className="h-7 text-xs font-semibold max-w-[180px]"/>
                        <span className="font-mono text-[11px] text-muted-foreground truncate" title={item.url}>
                          {item.url}
                        </span>
                        <Badge variant="outline" className="text-[9px] font-mono shrink-0 uppercase px-1 py-0 ml-auto">
                          {item.type}
                        </Badge>
                      </div>

                      { /* Controls */ }
                      <div className="flex items-center gap-1 shrink-0">
                        <Button type="button" variant="ghost" size="sm" onClick={()=>toggleSubItem(idx)} className="h-7 text-[10px] px-1.5" title="Toggle Dropdown Sub-Item">
                          {item.isSubItem ? 'Un-indent' : 'Sub-item'}
                        </Button>
                        <Button type="button" variant="ghost" size="icon" disabled={idx === 0} onClick={()=>moveItem(idx, 'up')} className="size-7" title="Move Up">
                          <MoveUpIcon className="size-3"/>
                        </Button>
                        <Button type="button" variant="ghost" size="icon" disabled={idx === menuItems.length - 1} onClick={()=>moveItem(idx, 'down')} className="size-7" title="Move Down">
                          <MoveDownIcon className="size-3"/>
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={()=>removeItem(idx)} className="size-7 text-destructive hover:bg-destructive/10" title="Remove from Menu">
                          <Trash2Icon className="size-3"/>
                        </Button>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
