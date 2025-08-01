'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, UserCircle, LogOut, FileText, Shield, Info, LogIn, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState, useCallback } from 'react';
import { getUserProfile } from '@/services/supabase';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');

  const fetchProfile = useCallback(async () => {
    if(user) {
        const profile = await getUserProfile(user.id);
        if(profile && profile.username) {
            setUsername(profile.username);
        }
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline">App Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences.</p>
        </div>

        {/* Appearance Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline text-2xl">Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Theme</h3>
                <p className="text-sm text-muted-foreground">Select a light or dark theme for the application.</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              {user ? <UserCircle className="w-6 h-6 text-primary" /> : <LogIn className="w-6 h-6 text-primary" />}
              <CardTitle className="font-headline text-2xl">Account</CardTitle>
            </div>
            <CardDescription>
              {user ? 'Manage your account settings and sign out.' : 'Log in or create an account to unlock all features.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {user ? (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Name</h3>
                            <p className="text-sm text-muted-foreground">{username || '...'}</p>
                        </div>
                    </div>
                    <Separator/>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-sm text-muted-foreground">{user?.email || 'No email associated'}</p>
                        </div>
                    </div>
                    <Separator/>
                     <Link href="/liked" passHref>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                            <Heart className="h-5 w-5 text-muted-foreground" /> Your Liked Items
                        </Button>
                    </Link>
                    <Separator />
                    <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </>
             ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="w-full">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                         <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
             )}
          </CardContent>
        </Card>

        {/* About & Legal Section */}
        <Card className="shadow-lg">
           <CardHeader>
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline text-2xl">About</CardTitle>
            </div>
            <CardDescription>View legal documents and learn more about KALA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/about" passHref>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                    <Info className="h-5 w-5 text-muted-foreground" /> About KALA
                </Button>
            </Link>
            <Link href="/terms-of-service" passHref>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                    <FileText className="h-5 w-5 text-muted-foreground" /> Terms of Service
                </Button>
            </Link>
            <Link href="/privacy-policy" passHref>
                <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                    <Shield className="h-5 w-5 text-muted-foreground" /> Privacy Policy
                </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
