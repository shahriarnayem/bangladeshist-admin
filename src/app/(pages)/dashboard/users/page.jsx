'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Shield, ShieldCheck, UserCheck, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // New staff form state
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('AUTHOR');
    const [newBio, setNewBio] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchUsers = async ()=>{
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (roleFilter !== 'ALL') params.set('role', roleFilter);
            const res = await fetch(`/api/users?${params.toString()}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.users)) {
                setUsers(data.users);
            }
        } catch  {
            toast.error('Failed to load newsroom users');
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchUsers();
    }, [
        roleFilter
    ]);
    const handleToggleBan = async (id, currentBanned)=>{
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isBanned: !currentBanned
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`User access ${!currentBanned ? 'banned' : 'unbanned'}`);
                setUsers((prev)=>prev.map((u)=>u.id === id ? {
                            ...u,
                            isBanned: !currentBanned
                        } : u));
            } else {
                toast.error(data.error || 'Failed to update user status');
            }
        } catch  {
            toast.error('Network error updating user');
        }
    };
    const handleDeleteUser = async (id, name)=>{
        if (!confirm(`Remove staff member "${name}" from newsroom?`)) return;
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Staff member removed');
                setUsers((prev)=>prev.filter((u)=>u.id !== id));
            } else {
                toast.error(data.error || 'Failed to remove user');
            }
        } catch  {
            toast.error('Network error deleting user');
        }
    };
    const handleCreateUser = async (e)=>{
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) {
            toast.error('Staff name and email are required');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    email: newEmail.trim().toLowerCase(),
                    role: newRole,
                    bio: newBio.trim() || 'Newsroom Contributor'
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Staff account created for ${data.user.name}`);
                setIsDialogOpen(false);
                setNewName('');
                setNewEmail('');
                setNewBio('');
                fetchUsers();
            } else {
                toast.error(data.error || 'Failed to create user');
            }
        } catch  {
            toast.error('Network error creating user');
        } finally{
            setIsSubmitting(false);
        }
    };
    const superAdminCount = users.filter((u)=>u.role === 'SUPER_ADMIN').length;
    const editorCount = users.filter((u)=>u.role === 'EDITOR').length;
    const authorCount = users.filter((u)=>u.role === 'AUTHOR').length;
    return <div className="space-y-6">
      { /* Header */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Newsroom Staff & User Management</h1>
          <p className="text-sm text-muted-foreground">
            Live MongoDB user store ({users.length} staff members and contributors).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`}/>
            Refresh
          </Button>
          <Button size="sm" onClick={()=>setIsDialogOpen(true)} className="gap-1.5 text-xs font-medium">
            <Plus className="size-4"/>
            Add Staff Member
          </Button>
        </div>
      </div>

      { /* Add Staff Dialog */ }
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Invite Staff Member</DialogTitle>
            <DialogDescription className="text-xs">
              Assign editorial privileges and configure author permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input placeholder="e.g. Tariqul Islam" value={newName} onChange={(e)=>setNewName(e.target.value)} className="text-xs"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Email Address</Label>
              <Input type="email" placeholder="tariqul@thechronicle.press" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} className="font-mono text-xs"/>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Editorial Role</Label>
              <Select value={newRole} onValueChange={(v)=>{
        if (v) setNewRole(v);
    }}>
                <SelectTrigger className="text-xs font-medium">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin (Full Access)</SelectItem>
                  <SelectItem value="ADMIN">Admin (Desk Manager)</SelectItem>
                  <SelectItem value="EDITOR">Editor (Publish & Review)</SelectItem>
                  <SelectItem value="AUTHOR">Author / Reporter (Draft Stories)</SelectItem>
                  <SelectItem value="SEO_MANAGER">SEO Manager (Meta & Feeds)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Designation / Job Title</Label>
              <Input placeholder="e.g. Senior Investigative Reporter" value={newBio} onChange={(e)=>setNewBio(e.target.value)} className="text-xs"/>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={()=>setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      { /* KPI Stats */ }
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Staff
            </CardTitle>
            <Users className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{users.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Registered newsroom users</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Super Admins
            </CardTitle>
            <Shield className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{superAdminCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Root governance accounts</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Desk Editors
            </CardTitle>
            <UserCheck className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{editorCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Editorial review gatekeepers</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reporters & Authors
            </CardTitle>
            <ShieldCheck className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{authorCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Field correspondents</p>
          </CardContent>
        </Card>
      </div>

      { /* Users Table */ }
      <Card className="border">
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground"/>
              <Input placeholder="Search staff by name or email..." value={searchQuery} onChange={(e)=>{
        setSearchQuery(e.target.value);
        fetchUsers();
    }} className="pl-8 text-xs"/>
            </div>

            <Select value={roleFilter} onValueChange={(v)=>{
        if (v) setRoleFilter(v);
    }}>
              <SelectTrigger className="w-[140px] text-xs font-medium">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="AUTHOR">Author</SelectItem>
                <SelectItem value="SEO_MANAGER">SEO Manager</SelectItem>
                <SelectItem value="READER">Reader</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="text-xs">
            {users.length} staff members
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Staff Member</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Designation</TableHead>
                <TableHead className="text-xs font-mono">Member Since</TableHead>
                <TableHead className="w-[90px] text-center text-xs">Status</TableHead>
                <TableHead className="w-[60px] text-center text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && users.length === 0 ? <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    Loading users from MongoDB...
                  </TableCell>
                </TableRow> : users.length === 0 ? <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    No users found matching query.
                  </TableCell>
                </TableRow> : users.map((user)=><TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 border">
                          <AvatarImage src={user.image}/>
                          <AvatarFallback className="font-semibold text-xs">
                            {user.name.split(' ').map((n)=>n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                            <span>{user.name}</span>
                            {user.isVerified && <CheckCircle2 className="size-3.5 text-foreground"/>}
                          </div>
                          <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {user.bio || 'Newsroom Contributor'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}
                    </TableCell>
                    <TableCell className="text-center">
                      <span onClick={()=>handleToggleBan(user.id, user.isBanned)} className={`cursor-pointer inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-semibold ${user.isBanned ? 'border-destructive bg-destructive/10 text-destructive' : 'border-foreground/30 text-foreground'}`}>
                        {user.isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground" onClick={()=>handleDeleteUser(user.id, user.name)}>
                        <Trash2 className="size-3.5"/>
                      </Button>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
