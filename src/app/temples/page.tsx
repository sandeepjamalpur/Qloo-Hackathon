
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Landmark, Loader2, Heart, MapPin, ImageOff, Search, Mic } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { unifiedSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { RecommendationCard } from '@/components/RecommendationCard';
import { TempleSearch } from '@/components/TempleSearch';


export default function TemplesPage() {
  const [searchResults, setSearchResults] = useState<CulturalItem[] | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const { toast } = useToast();

  useEffect(() => {
    // Perform an initial search when the component mounts
    handleSearch({ query: "famous temples" });
  }, []);

  const handleSearch = async (params: { query: string; place?: string }) => {
    if (!params.query.trim() && !params.place) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    setSearchResults(null);

    try {
      const results = await unifiedSearch({ 
        query: params.query || "famous temples",
        place: params.place 
      });
      setSearchResults(results);
       if (results.length === 0) {
        toast({ title: "No results found", description: "Try a different search." });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error searching",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
      
      <TempleSearch onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="text-center py-16 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-muted-foreground">Searching for sacred sites...</p>
        </div>
      ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                ))}
            </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
            <Landmark className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Temples Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                We couldn't find any temples matching your search. Please try a different query.
            </p>
        </div>
      )}
    </div>
  );
}
