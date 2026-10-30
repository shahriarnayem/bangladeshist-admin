'use client';

import { useState, useEffect } from 'react';
import {
    Mail,
    Save,
    Key,
    FileText,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Check,
    X,
    UserCog,
    Sparkles,
    Building2,
    Smartphone,
    Globe,
    Share2,
    ExternalLink,
    Lock,
    Eye,
    Bell,
    Sliders,
    Camera
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { toast } from 'sonner';

const ROLE_DEFINITIONS = {
    SUPER_ADMIN: {
        title: 'Super Administrator',
        badge: 'SUPER ADMIN',
        badgeVariant: 'default',
        description: 'Complete system control, database backups, staff user credentials, financial ads, system logs, and all editorial wires.',
        canPublish: true,
        canEditOthers: true,
        canManageUsers: true,
        canManageSystem: true,
        canManageAds: true,
        canCurateHomepage: true,
    },
    ADMIN: {
        title: 'Newsroom Administrator',
        badge: 'ADMIN',
        badgeVariant: 'default',
        description: 'Full newsroom management, journalists & staff administration, category hierarchy, media library, and SEO command desk.',
        canPublish: true,
        canEditOthers: true,
        canManageUsers: true,
        canManageSystem: false,
        canManageAds: true,
        canCurateHomepage: true,
    },
    EDITOR: {
        title: 'Editor-in-Chief / Section Editor',
        badge: 'EDITOR',
        badgeVariant: 'secondary',
        description: 'Editorial pipeline oversight, review queues, approving reporter submissions, wire publishing, and homepage broadsheet layout.',
        canPublish: true,
        canEditOthers: true,
        canManageUsers: false,
        canManageSystem: false,
        canManageAds: false,
        canCurateHomepage: true,
    },
    AUTHOR: {
        title: 'Staff Reporter & Author',
        badge: 'AUTHOR',
        badgeVariant: 'outline',
        description: 'Drafting and filing dispatches, personal story archive, uploading press photography, and generating social photocards.',
        canPublish: false,
        canEditOthers: false,
        canManageUsers: false,
        canManageSystem: false,
        canManageAds: false,
        canCurateHomepage: false,
    },
    SEO_MANAGER: {
        title: 'Newsroom SEO Strategist',
        badge: 'SEO MANAGER',
        badgeVariant: 'outline',
        description: 'Metadata optimization, SERP previews, XML sitemaps, robots configuration, and newsroom search rankings tracker.',
        canPublish: false,
        canEditOthers: false,
        canManageUsers: false,
        canManageSystem: false,
        canManageAds: false,
        canCurateHomepage: false,
    },
    READER: {
        title: 'Subscriber & Reader',
        badge: 'READER',
        badgeVariant: 'outline',
        description: 'Public news wire access, saved bookmarks, and submitting comments under published articles.',
        canPublish: false,
        canEditOthers: false,
        canManageUsers: false,
        canManageSystem: false,
        canManageAds: false,
        canCurateHomepage: false,
    }
};

const PERMISSION_COLUMNS = [
    { key: 'canPublish', label: 'Publish Live Dispatches' },
    { key: 'canEditOthers', label: 'Review / Edit Staff Drafts' },
    { key: 'canCurateHomepage', label: 'Curate Broadsheet Layout' },
    { key: 'canManageUsers', label: 'Staff & User Administration' },
    { key: 'canManageAds', label: 'Commercial Ads & Sponsorships' },
    { key: 'canManageSystem', label: 'Database Backup & System' }
];

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    // Profile state
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('SUPER_ADMIN');
    const [designation, setDesignation] = useState('Senior Diplomatic Correspondent & Lead Editor');
    const [phone, setPhone] = useState('+880 1711 002233');
    const [image, setImage] = useState('');
    const [bio, setBio] = useState('');
    const [articleCount, setArticleCount] = useState(0);
    const [mediaCount, setMediaCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);

    // Social Links
    const [twitter, setTwitter] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [website, setWebsite] = useState('');
    const [facebook, setFacebook] = useState('');

    // Available users for persona switching
    const [availableUsers, setAvailableUsers] = useState([]);

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Editorial Preferences
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [breakingNewsPush, setBreakingNewsPush] = useState(true);
    const [dailyDigest, setDailyDigest] = useState(false);
    const [autoSaveInterval, setAutoSaveInterval] = useState('30');
    const [defaultEditorMode, setDefaultEditorMode] = useState('blogger');

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.profile) {
                const p = data.profile;
                setUserId(p.id || '');
                setName(p.name || '');
                setEmail(p.email || '');
                setRole(p.role || 'SUPER_ADMIN');
                setBio(p.bio || '');
                setImage(p.image || '');
                setArticleCount(p._count?.articles ?? 0);
                setMediaCount(p._count?.media ?? 0);
                setCommentsCount(p._count?.comments ?? 0);

                // Parse social links if present
                if (p.socialLinks) {
                    try {
                        const parsed = typeof p.socialLinks === 'string' ? JSON.parse(p.socialLinks) : p.socialLinks;
                        setTwitter(parsed.twitter || '');
                        setLinkedin(parsed.linkedin || '');
                        setWebsite(parsed.website || '');
                        setFacebook(parsed.facebook || '');
                        if (parsed.designation) setDesignation(parsed.designation);
                        if (parsed.phone) setPhone(parsed.phone);
                    } catch {
                        // ignore JSON parse error
                    }
                }
            }

            if (data.availableUsers) {
                setAvailableUsers(data.availableUsers);
            }
        } catch (err) {
            toast.error('Failed to load editorial profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();

        const handlePersonaChanged = (e) => {
            if (e.detail) {
                fetchProfile();
            }
        };
        window.addEventListener('user-persona-changed', handlePersonaChanged);
        return () => window.removeEventListener('user-persona-changed', handlePersonaChanged);
    }, []);

    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        try {
            setIsSaving(true);
            const socialLinksPayload = {
                twitter: twitter.trim(),
                linkedin: linkedin.trim(),
                website: website.trim(),
                facebook: facebook.trim(),
                designation: designation.trim(),
                phone: phone.trim()
            };

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userId,
                    name,
                    email,
                    role,
                    bio,
                    image,
                    socialLinks: socialLinksPayload
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Author profile successfully saved to MongoDB');
                // Broadcast change so sidebar and header update live
                window.dispatchEvent(new CustomEvent('user-persona-changed', { detail: data.profile }));
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch {
            toast.error('Network error saving profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSwitchPersona = async (targetUserId) => {
        if (!targetUserId || targetUserId === userId) return;
        try {
            setIsSwitching(true);
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'switch',
                    userId: targetUserId
                })
            });

            const data = await res.json();
            if (data.success && data.profile) {
                toast.success(`Active persona switched to ${data.profile.name} (${data.profile.role})`);
                // Broadcast change
                window.dispatchEvent(new CustomEvent('user-persona-changed', { detail: data.profile }));
                fetchProfile();
            } else {
                toast.error(data.error || 'Failed to switch persona');
            }
        } catch {
            toast.error('Error switching persona');
        } finally {
            setIsSwitching(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            setIsUpdatingPassword(true);
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userId,
                    newPassword
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Security password successfully updated');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.error || 'Failed to update password');
            }
        } catch {
            toast.error('Network error updating password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'ED';

    const currentRoleMeta = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.SUPER_ADMIN;

    return (
        <div className='space-y-6 pb-12'>
            {/* Header */}
            <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <div className='flex items-center gap-2'>
                        <h1 className='text-2xl font-bold tracking-tight'>Staff Profile & Access Control</h1>
                        <Badge variant='outline' className='font-mono text-xs uppercase'>
                            RBAC NEWSROOM
                        </Badge>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                        Manage your author profile, public bio, Cloudinary avatar, security credentials, and newsroom role permissions.
                    </p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchProfile} disabled={loading}>
                        <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>

                    <Button size='sm' onClick={handleSaveProfile} disabled={isSaving} className='gap-1.5 text-xs font-medium'>
                        {isSaving ? <Loader2 className='size-3.5 animate-spin' /> : <Save className='size-3.5' />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Profile Overview Banner */}
            <Card className='border bg-card'>
                <CardContent className='flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
                        <Avatar className='size-20 border-2 border-border shadow-sm'>
                            {image ? <AvatarImage src={image} alt={name} className='object-cover' /> : null}
                            <AvatarFallback className='text-lg font-bold bg-muted text-foreground'>{initials}</AvatarFallback>
                        </Avatar>

                        <div className='space-y-1.5'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h2 className='text-xl font-bold text-foreground'>{name || 'Editorial Staff'}</h2>
                                <Badge className='font-mono text-[10px] tracking-wider uppercase'>
                                    {currentRoleMeta.badge}
                                </Badge>
                                <Badge variant='outline' className='font-mono text-[10px] text-muted-foreground'>
                                    Verified Author
                                </Badge>
                            </div>

                            <p className='text-xs text-muted-foreground font-medium'>
                                {designation}
                            </p>

                            <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1'>
                                <span className='flex items-center gap-1.5 font-mono text-[11px]'>
                                    <Mail className='size-3.5 text-foreground' /> {email}
                                </span>
                                <span className='flex items-center gap-1.5 font-mono text-[11px]'>
                                    <FileText className='size-3.5 text-foreground' /> {articleCount} Stories Filed
                                </span>
                                <span className='flex items-center gap-1.5 font-mono text-[11px]'>
                                    <Camera className='size-3.5 text-foreground' /> {mediaCount} Media Assets
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Persona Switcher Quick Pill */}
                    <div className='flex flex-col sm:items-end gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6'>
                        <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5'>
                            <UserCog className='size-3.5 text-foreground' /> Active Persona Switcher
                        </div>
                        <div className='w-full sm:w-60'>
                            <Select
                                value={userId}
                                onValueChange={handleSwitchPersona}
                                disabled={isSwitching}
                            >
                                <SelectTrigger className='h-8 text-xs font-medium'>
                                    <SelectValue placeholder='Switch Persona'>
                                        {name} ({role})
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className='max-h-72'>
                                    {availableUsers.map((u) => (
                                        <SelectItem key={u.id} value={u.id} className='text-xs'>
                                            <div className='flex items-center justify-between w-full gap-2'>
                                                <span className='font-medium'>{u.name}</span>
                                                <Badge variant='outline' className='text-[9px] font-mono'>
                                                    {u.role}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <span className='text-[10px] text-muted-foreground'>
                            Switch persona to preview role-based dashboard views.
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Configuration Tabs */}
            <Tabs defaultValue='profile' className='w-full'>
                <TabsList className='mb-6 grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl'>
                    <TabsTrigger value='profile' className='text-xs'>Profile & Bio</TabsTrigger>
                    <TabsTrigger value='rbac' className='text-xs'>Role & Permissions</TabsTrigger>
                    <TabsTrigger value='security' className='text-xs'>Security & Auth</TabsTrigger>
                    <TabsTrigger value='preferences' className='text-xs'>Newsroom Preferences</TabsTrigger>
                </TabsList>

                {/* TAB 1: PROFILE & BIO */}
                <TabsContent value='profile' className='space-y-6'>
                    <div className='grid gap-6 md:grid-cols-3'>
                        {/* Left 2 Cols: Text fields */}
                        <div className='space-y-6 md:col-span-2'>
                            <Card className='border'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-base font-semibold'>Author Profile & Bio</CardTitle>
                                    <CardDescription className='text-xs'>
                                        These details are displayed publicly beneath your published stories and in the author profile box.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div className='space-y-1.5'>
                                            <Label htmlFor='name' className='text-xs font-semibold'>Full Name</Label>
                                            <Input
                                                id='name'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className='text-xs font-semibold h-9'
                                                placeholder='e.g., Tanvir Hossain'
                                            />
                                        </div>

                                        <div className='space-y-1.5'>
                                            <Label htmlFor='email' className='text-xs font-semibold'>Newsroom Email Address</Label>
                                            <Input
                                                id='email'
                                                type='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className='font-mono text-xs h-9'
                                                placeholder='reporter@thechronicle.press'
                                            />
                                        </div>
                                    </div>

                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div className='space-y-1.5'>
                                            <Label htmlFor='designation' className='text-xs font-semibold'>Editorial Title / Beat Designation</Label>
                                            <Input
                                                id='designation'
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className='text-xs h-9'
                                                placeholder='e.g., Senior Diplomatic Correspondent'
                                            />
                                        </div>

                                        <div className='space-y-1.5'>
                                            <Label htmlFor='phone' className='text-xs font-semibold'>Desk Telephone / Extension</Label>
                                            <Input
                                                id='phone'
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className='font-mono text-xs h-9'
                                                placeholder='+880 1711 002233'
                                            />
                                        </div>
                                    </div>

                                    <div className='space-y-1.5'>
                                        <div className='flex items-center justify-between'>
                                            <Label htmlFor='bio' className='text-xs font-semibold'>Public Author Biography</Label>
                                            <span className='text-[10px] text-muted-foreground font-mono'>
                                                {bio.length} characters
                                            </span>
                                        </div>
                                        <Textarea
                                            id='bio'
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className='text-xs leading-relaxed'
                                            placeholder='Journalist and geopolitical analyst covering South Asian diplomacy, foreign policy, and regional security...'
                                        />
                                        <p className='text-muted-foreground text-[11px]'>
                                            Rendered at the bottom of all published news stories and in the author directory.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social & Syndication Handles */}
                            <Card className='border'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-base font-semibold'>Social Handles & Syndication</CardTitle>
                                    <CardDescription className='text-xs'>
                                        Link your official journalistic social accounts for verification and readership growth.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-3.5'>
                                    <div className='grid gap-3 sm:grid-cols-2'>
                                        <div className='space-y-1.5'>
                                            <Label className='text-xs font-semibold flex items-center gap-1.5'>
                                                <Share2 className='size-3.5 text-foreground' /> X / Twitter Handle
                                            </Label>
                                            <Input
                                                value={twitter}
                                                onChange={(e) => setTwitter(e.target.value)}
                                                placeholder='@thechronicle_press'
                                                className='font-mono text-xs h-9'
                                            />
                                        </div>

                                        <div className='space-y-1.5'>
                                            <Label className='text-xs font-semibold flex items-center gap-1.5'>
                                                <Globe className='size-3.5 text-foreground' /> LinkedIn Profile URL
                                            </Label>
                                            <Input
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                                placeholder='https://linkedin.com/in/tanvir'
                                                className='font-mono text-xs h-9'
                                            />
                                        </div>
                                    </div>

                                    <div className='grid gap-3 sm:grid-cols-2'>
                                        <div className='space-y-1.5'>
                                            <Label className='text-xs font-semibold flex items-center gap-1.5'>
                                                <Globe className='size-3.5 text-foreground' /> Personal Portfolio / Website
                                            </Label>
                                            <Input
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder='https://tanvirpress.com'
                                                className='font-mono text-xs h-9'
                                            />
                                        </div>

                                        <div className='space-y-1.5'>
                                            <Label className='text-xs font-semibold flex items-center gap-1.5'>
                                                <ExternalLink className='size-3.5 text-foreground' /> Facebook / Other
                                            </Label>
                                            <Input
                                                value={facebook}
                                                onChange={(e) => setFacebook(e.target.value)}
                                                placeholder='https://facebook.com/tanvir.chronicle'
                                                className='font-mono text-xs h-9'
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Col: Profile Avatar via ImagePicker */}
                        <div className='space-y-6'>
                            <Card className='border'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-base font-semibold'>Author Headshot Photo</CardTitle>
                                    <CardDescription className='text-xs'>
                                        High-resolution photograph for author profile and articles.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <ImagePicker
                                        label="Author Headshot"
                                        value={image}
                                        onChange={setImage}
                                        aspectRatio="square"
                                        description="Upload square portrait via Cloudinary or select from Media Library."
                                    />

                                    <div className='space-y-1.5 pt-2 border-t'>
                                        <Label className='text-xs font-semibold'>Direct Image URL</Label>
                                        <Input
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder='https://res.cloudinary.com/...'
                                            className='font-mono text-[11px] h-8'
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className='border-t pt-3 bg-muted/20'>
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className='w-full text-xs font-medium gap-1.5'
                                    >
                                        {isSaving ? <Loader2 className='size-3.5 animate-spin' /> : <Save className='size-3.5' />}
                                        Save Profile
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: ROLE & PERMISSIONS MATRIX */}
                <TabsContent value='rbac' className='space-y-6'>
                    {/* Active Role Card */}
                    <Card className='border'>
                        <CardHeader className='pb-3'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle className='text-base font-semibold'>Active Role Assignment</CardTitle>
                                    <CardDescription className='text-xs'>
                                        Role-Based Access Control (RBAC) dynamically restricts dashboard views, navigation items, and action permissions.
                                    </CardDescription>
                                </div>
                                <Badge className='font-mono text-xs tracking-wider uppercase'>
                                    {role}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='p-4 rounded-lg border bg-muted/30 space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <ShieldCheck className='size-5 text-foreground' />
                                    <span className='font-bold text-sm'>{currentRoleMeta.title}</span>
                                </div>
                                <p className='text-xs text-muted-foreground leading-relaxed'>
                                    {currentRoleMeta.description}
                                </p>
                            </div>

                            {/* Role selector for administrators */}
                            {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border rounded-lg bg-card'>
                                    <div>
                                        <div className='text-xs font-semibold'>Adjust System Role (Admin Override)</div>
                                        <div className='text-[11px] text-muted-foreground'>
                                            Update your account role to verify navigation and dashboard views.
                                        </div>
                                    </div>
                                    <div className='w-48'>
                                        <Select value={role} onValueChange={(val) => setRole(val)}>
                                            <SelectTrigger className='h-8 text-xs font-medium'>
                                                <SelectValue placeholder='Select Role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(ROLE_DEFINITIONS).map(([rKey, rMeta]) => (
                                                    <SelectItem key={rKey} value={rKey} className='text-xs'>
                                                        {rMeta.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Newsroom RBAC Matrix Table */}
                    <Card className='border'>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-base font-semibold'>Newsroom Permissions Matrix</CardTitle>
                            <CardDescription className='text-xs'>
                                Comprehensive matrix of newsroom capabilities across all six system roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='p-0 overflow-x-auto'>
                            <table className='w-full text-xs text-left border-collapse'>
                                <thead>
                                    <tr className='border-b bg-muted/40 font-mono text-[11px] text-muted-foreground'>
                                        <th className='py-3 px-4'>Role Persona</th>
                                        {PERMISSION_COLUMNS.map((col) => (
                                            <th key={col.key} className='py-3 px-3 text-center'>
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className='py-3 px-4 text-right'>Quick Test</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y'>
                                    {Object.entries(ROLE_DEFINITIONS).map(([rKey, rMeta]) => {
                                        const isCurrent = role === rKey;
                                        // Find a sample user for this role
                                        const matchingUser = availableUsers.find((u) => u.role === rKey);

                                        return (
                                            <tr
                                                key={rKey}
                                                className={`transition-colors hover:bg-muted/30 ${isCurrent ? 'bg-muted/20 font-medium' : ''}`}
                                            >
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <Badge
                                                            variant={isCurrent ? 'default' : 'outline'}
                                                            className='font-mono text-[10px]'
                                                        >
                                                            {rKey}
                                                        </Badge>
                                                        {isCurrent && (
                                                            <span className='text-[10px] text-muted-foreground font-mono'>
                                                                (Active)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className='text-[11px] text-muted-foreground mt-0.5'>
                                                        {rMeta.title}
                                                    </div>
                                                </td>

                                                {PERMISSION_COLUMNS.map((col) => {
                                                    const allowed = rMeta[col.key];
                                                    return (
                                                        <td key={col.key} className='py-3 px-3 text-center'>
                                                            {allowed ? (
                                                                <span className='inline-flex items-center justify-center size-5 rounded-full bg-foreground text-background'>
                                                                    <Check className='size-3 stroke-[2.5]' />
                                                                </span>
                                                            ) : (
                                                                <span className='inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground'>
                                                                    <X className='size-3 stroke-[2]' />
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                })}

                                                <td className='py-3 px-4 text-right'>
                                                    {matchingUser ? (
                                                        <Button
                                                            variant={isCurrent ? 'outline' : 'secondary'}
                                                            size='sm'
                                                            className='h-7 text-[11px]'
                                                            disabled={isCurrent || isSwitching}
                                                            onClick={() => handleSwitchPersona(matchingUser.id)}
                                                        >
                                                            {isCurrent ? 'Current' : `Switch to ${matchingUser.name.split(' ')[0]}`}
                                                        </Button>
                                                    ) : (
                                                        <span className='text-[10px] text-muted-foreground'>
                                                            No test user
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: SECURITY & AUTH */}
                <TabsContent value='security' className='space-y-6'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        {/* Password Update Form */}
                        <Card className='border'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-base font-semibold'>Password & Authentication</CardTitle>
                                <CardDescription className='text-xs'>
                                    Update your editorial login password to keep newsroom dispatches secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdatePassword} className='space-y-4'>
                                    <div className='space-y-1.5'>
                                        <Label htmlFor='currPass' className='text-xs font-semibold'>Current Password</Label>
                                        <Input
                                            id='currPass'
                                            type='password'
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className='text-xs h-9'
                                            placeholder='••••••••••••'
                                        />
                                    </div>

                                    <div className='space-y-1.5'>
                                        <Label htmlFor='newPass' className='text-xs font-semibold'>New Password</Label>
                                        <Input
                                            id='newPass'
                                            type='password'
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className='text-xs h-9'
                                            placeholder='Minimum 6 characters'
                                        />
                                    </div>

                                    <div className='space-y-1.5'>
                                        <Label htmlFor='confirmPass' className='text-xs font-semibold'>Confirm New Password</Label>
                                        <Input
                                            id='confirmPass'
                                            type='password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className='text-xs h-9'
                                            placeholder='Repeat new password'
                                        />
                                    </div>

                                    <Button
                                        type='submit'
                                        size='sm'
                                        disabled={isUpdatingPassword}
                                        className='gap-1.5 text-xs font-medium w-full'
                                    >
                                        {isUpdatingPassword ? <Loader2 className='size-3.5 animate-spin' /> : <Key className='size-3.5' />}
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Active Session & Audit Telemetry */}
                        <div className='space-y-6'>
                            <Card className='border'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-base font-semibold'>Active Session Telemetry</CardTitle>
                                    <CardDescription className='text-xs'>
                                        Verified newsroom session and database identity token.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-3 text-xs font-mono'>
                                    <div className='flex items-center justify-between p-2.5 rounded border bg-muted/20'>
                                        <span className='text-muted-foreground'>MongoDB User ID:</span>
                                        <span className='font-bold text-foreground truncate max-w-[180px]'>
                                            {userId || 'Loading...'}
                                        </span>
                                    </div>

                                    <div className='flex items-center justify-between p-2.5 rounded border bg-muted/20'>
                                        <span className='text-muted-foreground'>Cookie Session:</span>
                                        <span className='text-foreground font-semibold'>cms_user_id (Active)</span>
                                    </div>

                                    <div className='flex items-center justify-between p-2.5 rounded border bg-muted/20'>
                                        <span className='text-muted-foreground'>Account Status:</span>
                                        <Badge variant='outline' className='font-mono text-[10px] text-foreground'>
                                            VERIFIED JOURNALIST
                                        </Badge>
                                    </div>

                                    <div className='flex items-center justify-between p-2.5 rounded border bg-muted/20'>
                                        <span className='text-muted-foreground'>Role Privilege:</span>
                                        <Badge className='font-mono text-[10px] uppercase'>
                                            {role}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='border'>
                                <CardHeader className='pb-2'>
                                    <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                                        Editorial Security Note
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='text-xs text-muted-foreground leading-relaxed'>
                                    All content modifications, wire dispatches, and persona switches are permanently recorded in the immutable MongoDB Audit Log for compliance and journalism integrity.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 4: NEWSROOM PREFERENCES */}
                <TabsContent value='preferences' className='space-y-6'>
                    <Card className='border max-w-2xl'>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-base font-semibold'>Newsroom & Editorial Preferences</CardTitle>
                            <CardDescription className='text-xs'>
                                Customize notification triggers, auto-save cadences, and editing behavior.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-5'>
                            {/* Alert 1 */}
                            <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <Label className='text-xs font-semibold'>Breaking News Push Alerts</Label>
                                    <p className='text-[11px] text-muted-foreground'>
                                        Receive real-time notifications when a flash breaking news bulletin is published.
                                    </p>
                                </div>
                                <Switch
                                    checked={breakingNewsPush}
                                    onCheckedChange={setBreakingNewsPush}
                                />
                            </div>

                            {/* Alert 2 */}
                            <div className='flex items-center justify-between border-t pt-4'>
                                <div className='space-y-0.5'>
                                    <Label className='text-xs font-semibold'>Editorial Review & Draft Approvals</Label>
                                    <p className='text-[11px] text-muted-foreground'>
                                        Notify me via email when an author submits a story for review or approval.
                                    </p>
                                </div>
                                <Switch
                                    checked={emailAlerts}
                                    onCheckedChange={setEmailAlerts}
                                />
                            </div>

                            {/* Alert 3 */}
                            <div className='flex items-center justify-between border-t pt-4'>
                                <div className='space-y-0.5'>
                                    <Label className='text-xs font-semibold'>Daily Wire Summary Digest</Label>
                                    <p className='text-[11px] text-muted-foreground'>
                                        Morning executive digest of articles, pageviews, and reader engagement.
                                    </p>
                                </div>
                                <Switch
                                    checked={dailyDigest}
                                    onCheckedChange={setDailyDigest}
                                />
                            </div>

                            {/* Auto-save Cadence */}
                            <div className='flex items-center justify-between border-t pt-4'>
                                <div className='space-y-0.5'>
                                    <Label className='text-xs font-semibold'>Article Composer Auto-Save</Label>
                                    <p className='text-[11px] text-muted-foreground'>
                                        Interval for saving editorial drafts automatically in background.
                                    </p>
                                </div>
                                <div className='w-36'>
                                    <Select value={autoSaveInterval} onValueChange={setAutoSaveInterval}>
                                        <SelectTrigger className='h-8 text-xs font-medium'>
                                            <SelectValue placeholder='Interval' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='15' className='text-xs'>Every 15s</SelectItem>
                                            <SelectItem value='30' className='text-xs'>Every 30s</SelectItem>
                                            <SelectItem value='60' className='text-xs'>Every 60s</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Editor Mode */}
                            <div className='flex items-center justify-between border-t pt-4'>
                                <div className='space-y-0.5'>
                                    <Label className='text-xs font-semibold'>Default Article Editor Experience</Label>
                                    <p className='text-[11px] text-muted-foreground'>
                                        Visual Blogger/Wordpress WYSIWYG versus split Markdown.
                                    </p>
                                </div>
                                <div className='w-44'>
                                    <Select value={defaultEditorMode} onValueChange={setDefaultEditorMode}>
                                        <SelectTrigger className='h-8 text-xs font-medium'>
                                            <SelectValue placeholder='Editor Mode' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='blogger' className='text-xs'>WYSIWYG Visual Mode</SelectItem>
                                            <SelectItem value='markdown' className='text-xs'>Split Markdown Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='border-t pt-4 bg-muted/20'>
                            <Button
                                size='sm'
                                onClick={() => toast.success('Editorial preferences successfully saved')}
                                className='text-xs font-medium gap-1.5'
                            >
                                <Save className='size-3.5' /> Save Preferences
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
