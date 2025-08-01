
'use server';

import { createSupabaseBrowserClient } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabase-server';

interface UserProfileData {
  username: string;
  favoriteArtists: string;
  preferredCuisines: string;
  styleInspirations: string;
  currentMood?: string;
}

// We instantiate the client here, but it could be null if config is missing.
const supabase = createSupabaseBrowserClient();

export async function createUserProfile(userId: string, data: UserProfileData) {
  if (!supabase) {
    console.warn("Supabase is not configured. Skipping profile creation.");
    return;
  }

  // Check if the user being created is the admin user
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'admin@kala.com';
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
          id: userId,
          // If it's the admin, force the username to 'Sunny'
          username: isAdmin ? 'Sunny' : data.username,
          favorite_artists: data.favoriteArtists,
          preferred_cuisines: data.preferredCuisines,
          style_inspirations: data.styleInspirations,
          current_mood: data.currentMood,
       });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating user profile in Supabase:', error);
    throw new Error('Could not create user profile.');
  }
}

export async function getUserProfile(userId: string) {
    if (!supabase) {
        console.warn("Supabase is not configured. Skipping profile check.");
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
             throw error;
        }

        return data;

    } catch(error) {
        console.error('Error getting user profile from Supabase:', error);
        return null;
    }
}


/**
 * Uploads an image from a URL or a Data URI to a Supabase storage bucket.
 * @param sourceUrl The URL or Data URI of the image to fetch.
 * @param fileName The desired file name for the image in the bucket.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImageFromUrl(sourceUrl: string, fileName: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("Supabase credentials are not set in .env. Skipping image upload and returning placeholder.");
        return 'https://placehold.co/800x600.png';
    }
    
    const supabaseAdmin = await createSupabaseServerClient();
    const BUCKET_NAME = 'item-images';

    try {
        let imageBuffer: ArrayBuffer;
        let contentType: string;

        if (sourceUrl.startsWith('data:')) {
            // Handle Data URI
            const parts = sourceUrl.split(',');
            const meta = parts[0].split(';')[0].replace('data:', '');
            const base64Data = parts[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
            contentType = meta || 'image/png';
        } else {
            // Handle standard URL
            const headResponse = await fetch(sourceUrl, { method: 'HEAD', redirect: 'manual' });
            const finalImageUrl = headResponse.headers.get('location') || sourceUrl;

            const imageResponse = await fetch(finalImageUrl);
            if (!imageResponse.ok) {
                throw new Error(`Failed to fetch final image from ${finalImageUrl}. Status: ${imageResponse.status}`);
            }
            imageBuffer = await imageResponse.arrayBuffer();
            contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        }

        // Upload the image buffer to Supabase Storage.
        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(fileName, imageBuffer, {
                contentType: contentType,
                upsert: true,
            });

        if (uploadError) {
            throw uploadError;
        }

        // Get the public URL for the uploaded file.
        const { data } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        if (!data || !data.publicUrl) {
            throw new Error('Could not get public URL for the uploaded image.');
        }

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image to Supabase:', error);
        return 'https://placehold.co/800x600.png';
    }
}
