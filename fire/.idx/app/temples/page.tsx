
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Landmark, Loader2, Heart, MapPin, ImageOff, Search, Mic } from 'lucide-react';
import type { CulturalItem } from 'fire/src/types';
import { useToast } from "fire/src/hooks/use-toast";
import { unifiedSearch } from 'fire/src/app/actions';
import { Button } from 'fire/src/components/ui/button';
import { useLikedItems } from 'fire/src/contexts/LikedItemsContext';
import { cn } from 'fire/src/lib/utils';
import { Card, CardContent } from 'fire/src/components/ui/card';
import { RecommendationCard } from 'fire/src/components/RecommendationCard';
import { TempleSearch } from 'fire/src/components/TempleSearch';


const allTempleItems: CulturalItem[] = [
  {
    id: 'temple-golden',
    name: 'Golden Temple (Harmandir Sahib)',
    category: 'Temple',
    description: 'The spiritual and cultural center for the Sikh religion. This stunning temple, located in Amritsar, is surrounded by a sacred pool and is famed for its beautiful gold-plated exterior.',
    image: 'https://images.unsplash.com/photo-1623059508779-2542c6e83753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxnb2xkZW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: "A symbol of peace and spiritual solace, its langar (community kitchen) serves thousands daily.",
    state: 'Punjab',
  },
  {
    id: 'temple-meenakshi',
    name: 'Meenakshi Amman Temple',
    category: 'Temple',
    description: 'Located in Madurai, this historic Hindu temple is dedicated to Meenakshi and her consort, Sundareshwarar. It is renowned for its towering gopurams (gateways) covered in colorful figures.',
    image: 'https://images.unsplash.com/photo-1692173248120-59547c3d4653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNZWVuYWtzaGklMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1NTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: 'A masterpiece of Dravidian architecture, offering a dazzling visual and spiritual experience.',
    state: 'Tamil Nadu',
  },
  {
    id: 'temple-padmanabhaswamy',
    name: 'Sri Padmanabhaswamy Temple',
    category: 'Temple',
    description: 'Located in Thiruvananthapuram, Kerala, this temple is a blend of Kerala and Dravidian styles of architecture. It is famed for its intricate carvings and the mysterious, unopened vault it holds.',
    image: 'https://images.unsplash.com/photo-1644773182204-f0bf03cae0cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxTcmklMjBQYWRtYW5hYmhhc3dhbXklMjBUZW1wbGV8ZW58MHx8fHwxNzUyNjc1NzUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    "data-ai-hint": "padmanabhaswamy temple",
    reviews: [],
    reason: 'Discover a temple shrouded in mystery and history, known for its immense hidden treasures and stunning architecture.',
    state: 'Kerala',
  },
  {
    id: 'temple-sun-konark',
    name: 'Konark Sun Temple',
    category: 'Temple',
    description: 'A 13th-century CE Sun temple at Konark in Odisha. The temple is attributed to king Narasimhadeva I of the Eastern Ganga Dynasty about 1250 CE. It is designed as a colossal chariot for the sun god, Surya.',
    image: 'https://images.unsplash.com/photo-1695692928722-8120423aabe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxrb25hcmslMjBzdW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: 'Marvel at the architectural genius of a temple shaped like a giant chariot for the Sun God.',
    state: 'Odisha',
  },
  {
    id: 'temple-tirupati-balaji',
    name: 'Tirupati Balaji Temple',
    category: 'Temple',
    description: "The world's most visited temple, receiving 50,000 to 100,000 devotees daily and up to 40 million visitors annually. Dedicated to Lord Venkateswara, it's also one of the richest temples in the world.",
    image: 'https://images.unsplash.com/photo-1608035111124-484191a329de?q=80&w=1974',
    "data-ai-hint": 'tirupati balaji',
    reviews: [],
    reason: "Visit one of the most revered and wealthiest temples in the world, a major pilgrimage site.",
    state: 'Andhra Pradesh',
  },
];

const FeaturedTempleCard = ({ item, featuredText }: { item: CulturalItem, featuredText: string }) => (
  <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
    <p className="font-semibold text-sm uppercase tracking-wider mb-2">{featuredText}</p>
    <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
    <p className="text-sm opacity-90">{item.description}</p>
  </div>
);

const TempleSection = ({ item, featuredText, reverse = false }: { item: CulturalItem, featuredText: string, reverse?: boolean }) => {
    const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
    const liked = isLiked(item.id);

    const handleLikeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            removeLikedItem(item.id);
        } else {
            addLikedItem(item);
        }
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center py-8 md:py-12",
            reverse ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
        )}>
            <div className={cn(
            "relative w-4/5 md:w-1/2 z-10",
            reverse ? "md:-mr-16" : "md:-ml-16"
            )}>
            <FeaturedTempleCard item={item} featuredText={featuredText} />
            </div>
            <div className="relative w-full md:w-3/12 h-48 md:h-56 -mt-16 md:mt-0 group">
                {item.image ? <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="indian temple"
                /> : <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center"><ImageOff className="w-10 h-10 text-muted-foreground"/></div>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLikeToggle}
                    aria-label={liked ? 'Unlike' : 'Like'}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white hover:text-white"
                >
                    <Heart className={cn('transition-colors', liked && 'fill-destructive text-destructive')} />
                </Button>
            </div>
        </div>
    );
};


export default function TemplesPage() {
  const [searchResults, setSearchResults] = useState<CulturalItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      ) : searchResults !== null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                        <RecommendationCard key={item.id} item={item} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <Landmark className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Temples Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn't find any temples matching your search.
                        </p>
                    </div>
                )}
            </div>
      ) : (
        <div className="space-y-12">
            <TempleSection item={allTempleItems[0]} featuredText="Featured Temple" reverse={false} />
            <TempleSection item={allTempleItems[1]} featuredText="Architectural Marvel" reverse={true} />
            <TempleSection item={allTempleItems[2]} featuredText="Spiritual Pilgrimage" reverse={false} />
            <TempleSection item={allTempleItems[3]} featuredText="Historic Wonder" reverse={true} />
        </div>
      )}
    </div>
  );
}
