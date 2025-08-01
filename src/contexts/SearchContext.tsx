
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const SEARCH_LIMIT = 8;
const STORAGE_KEY = 'guestSearchCount';
const ADMIN_EMAIL = 'admin@kala.com'; // Admin user email

interface SearchContextType {
  searchCount: number;
  handleSearchAttempt: () => boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchCount, setSearchCount] = useState(0);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      try {
        const storedCount = localStorage.getItem(STORAGE_KEY);
        setSearchCount(storedCount ? parseInt(storedCount, 10) : 0);
      } catch (error) {
        console.warn("Could not access localStorage. Guest search count will not be persisted.");
        setSearchCount(0);
      }
    } else if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.removeItem(STORAGE_KEY);
      setSearchCount(0);
    }
  }, [user]);

  const handleSearchAttempt = useCallback(() => {
    // Admin user and regular logged-in users can always search
    if (user && (user.email === ADMIN_EMAIL || user.email)) {
      return true; 
    }
    
    // Use a function for the new count to avoid stale state issues.
    let newCount = 0;
    setSearchCount(currentCount => {
        newCount = currentCount + 1;
        if (currentCount >= SEARCH_LIMIT) {
          toast({
            title: 'Search Limit Reached',
            description: 'Please log in or create an account to continue searching.',
          });
          router.push('/login');
          return currentCount; // Don't increment if limit is reached
        }

        try {
          localStorage.setItem(STORAGE_KEY, newCount.toString());
        } catch (error) {
            console.warn("Could not access localStorage. Guest search count will not be persisted.");
        }
        return newCount;
    });

    return newCount <= SEARCH_LIMIT;
  }, [user, router, toast]);

  const value = {
    searchCount,
    handleSearchAttempt,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
