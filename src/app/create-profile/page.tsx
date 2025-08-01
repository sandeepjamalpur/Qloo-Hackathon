
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck } from 'lucide-react';
import { createUserProfile } from '@/services/supabase';

export default function CreateProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to create a profile.',
      });
      router.push('/login');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const profileData = {
      favoriteArtists: formData.get('favoriteArtists') as string,
      preferredCuisines: formData.get('preferredCuisines') as string,
      styleInspirations: formData.get('styleInspirations') as string,
      currentMood: formData.get('currentMood') as string,
    };

    try {
      await createUserProfile(user.id, profileData);
      toast({
        title: 'Profile Created!',
        description: 'Welcome to Cultura! You are now ready to explore.',
      });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Profile Creation Failed',
        description: 'Something went wrong. Please try again.',
      });
      setLoading(false);
    }
  };

  if (!user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="animate-spin text-primary h-12 w-12" />
          <p className="mt-4 text-muted-foreground">Verifying your session...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-4">
             <UserCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline">Tell Us About Your Taste</CardTitle>
          <CardDescription>
            Just one last step. This will help us tailor recommendations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="favoriteArtists">Favorite artists or genres?</Label>
              <Textarea
                id="favoriteArtists"
                name="favoriteArtists"
                placeholder="e.g., David Lynch, Kendrick Lamar, Impressionism..."
                className="min-h-[80px]"
                disabled={loading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="preferredCuisines">Preferred cuisines?</Label>
              <Input
                id="preferredCuisines"
                name="preferredCuisines"
                placeholder="e.g., Italian, Japanese, comfort food..."
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="styleInspirations">Any style inspirations?</Label>
              <Input
                id="styleInspirations"
                name="styleInspirations"
                placeholder="e.g., minimalist, vintage, brutalist architecture..."
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentMood">
                Optional: What's your current mood or occasion?
              </Label>
              <Input
                id="currentMood"
                name="currentMood"
                placeholder="e.g., adventurous, relaxing weekend, a night out..."
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Complete Profile & Start Exploring'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
