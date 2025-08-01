

import { createBrowserClient } from '@supabase/ssr'

export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function createSupabaseBrowserClient() {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    // Return null or handle the absence of credentials gracefully.
    // This prevents the app from crashing.
    console.warn('Supabase URL or anon key is missing. Supabase client not created.');
    return null;
  }
  return createBrowserClient(
   supabaseConfig.url,
   supabaseConfig.anonKey
  )
}
