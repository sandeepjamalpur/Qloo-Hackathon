
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { LikedItemsProvider } from '@/contexts/LikedItemsContext';
import { AppLayout } from '@/components/AppLayout';
import { Toaster } from '@/components/ui/toaster';
import { SearchProvider } from '@/contexts/SearchContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SearchProvider>
          <LikedItemsProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </LikedItemsProvider>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
