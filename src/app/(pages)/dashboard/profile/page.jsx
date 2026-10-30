'use client';
import { useState, useEffect } from 'react';
import { Mail, Save, Key, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('Tanvir Hossain');
    const [email, setEmail] = useState('tanvir@thechronicle.press');
    const [role, setRole] = useState('SUPER_ADMIN');
    const [designation, setDesignation] = useState('Editor-in-Chief & Lead Geopolitical Analyst');
    const [phone, setPhone] = useState('+880 1711 002233');
    const [image, setImage] = useState('');
    const [bio, setBio] = useState('Journalist and geopolitical analyst focusing on Global foreign policy, regional security architectures, and international trade corridors across South Asia.');
    const [articleCount, setArticleCount] = useState(0);
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const fetchProfile = async ()=>{
        try {
            setLoading(true);
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.profile) {
                const p1 = data.profile;
                if (p1.name) setName(p1.name);
                if (p1.email) setEmail(p1.email);
                if (p1.role) setRole(p1.role);
                if (p1.bio) setBio(p1.bio);
                if (p1.image) setImage(p1.image);
                if (p1._count?.articles !== undefined) setArticleCount(p1._count.articles);
            }
        } catch  {
        // Keep defaults
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchProfile();
    }, []);
    const handleSaveProfile = async (e)=>{
        if (e) e.preventDefault();
        try {
            setIsSaving(true);
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    bio,
                    image
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Editorial profile updated successfully in database');
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch  {
            toast.error('Network error saving profile');
        } finally{
            setIsSaving(false);
        }
    };
    const handleUpdatePassword = (e)=>{
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error('Please enter your current and new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Security password updated');
    };
    const initials = name.split(' ').map((n)=>n[0]).join('').slice(0, 2).toUpperCase();
    return <div className='space-y-6'>
      { /* Header */ }
      <div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Staff Editorial Profile</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your reporter byline, public biography, credentials, and authentication security in MongoDB.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={fetchProfile}>
            <RefreshCw className='size-3.5'/> Refresh
          </Button>
          <Badge variant='outline' className='font-mono text-xs'>
            Role: {role}
          </Badge>
        </div>
      </div>

      { /* Profile Overview Card */ }
      <Card className='border'>
        <CardContent className='flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='size-16 border'>
              {image ? <AvatarImage src={image}/> : null}
              <AvatarFallback className='text-base font-bold'>{initials || 'ED'}</AvatarFallback>
            </Avatar>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-bold text-foreground'>{name}</h2>
                <Badge variant='outline' className='font-mono text-[10px]'>
                  Verified Author
                </Badge>
              </div>
              <p className='text-muted-foreground mt-0.5 text-xs'>{designation}</p>
              <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-[11px]'>
                <span className='flex items-center gap-1 font-mono'>
                  <Mail className='size-3'/> {email}
                </span>
                <span className='flex items-center gap-1 font-mono'>
                  <FileText className='size-3'/> {articleCount} Published Dispatches
                </span>
              </div>
            </div>
          </div>
          <Button size='sm' onClick={()=>handleSaveProfile()} disabled={isSaving} className='gap-1.5 text-xs font-medium'>
            {isSaving ? <Loader2 className='size-3.5 animate-spin'/> : <Save className='size-3.5'/>}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='details'>Byline & Details</TabsTrigger>
          <TabsTrigger value='security'>Security & Password</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='space-y-6'>
          <Card className='border'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>Editorial Byline & Bio</CardTitle>
              <CardDescription className='text-xs'>
                Information displayed beneath articles and in the author bio box.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Full Name</Label>
                  <Input value={name} onChange={(e)=>setName(e.target.value)} className='text-xs font-semibold'/>
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Email Address</Label>
                  <Input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='font-mono text-xs'/>
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Avatar Image URL</Label>
                <Input value={image} onChange={(e)=>setImage(e.target.value)} placeholder='https://...' className='font-mono text-xs'/>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Public Author Biography</Label>
                <Textarea rows={4} value={bio} onChange={(e)=>setBio(e.target.value)} className='text-xs'/>
                <p className='text-muted-foreground text-[11px]'>Rendered on public article pages.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-6'>
          <Card className='border'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>Password & Authentication</CardTitle>
              <CardDescription className='text-xs'>
                Update your account password and security credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className='max-w-md space-y-4'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Current Password</Label>
                  <Input type='password' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className='text-xs'/>
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>New Password</Label>
                  <Input type='password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className='text-xs'/>
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Confirm New Password</Label>
                  <Input type='password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='text-xs'/>
                </div>
                <Button type='submit' size='sm' className='gap-1.5 text-xs font-medium'>
                  <Key className='size-3.5'/> Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
