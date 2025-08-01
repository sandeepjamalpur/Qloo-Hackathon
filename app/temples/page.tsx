
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Landmark, Loader2, Heart, BookOpen, Link as LinkIcon, ImageOff } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { unifiedSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { cn } from '@/lib/utils';
import { TempleSearch } from '@/components/TempleSearch';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import { useSearch } from '@/contexts/SearchContext';


const allTempleItems: CulturalItem[] = [
  {
    id: 'temple-golden',
    name: 'Golden Temple (Harmandir Sahib)',
    category: 'Temple',
    description: 'The spiritual and cultural center for the Sikh religion. This stunning temple, located in Amritsar, is surrounded by a sacred pool and is famed for its beautiful gold-plated exterior.',
    image: 'https://images.unsplash.com/photo-1623059508779-2542c6e83753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxnb2xkZW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'A truly serene and spiritual place. The langar is an experience in humility and service.',
        'The gleaming gold and the reflections in the water are mesmerizing.',
    ],
    reason: "A symbol of peace and spiritual solace, its langar (community kitchen) serves thousands daily.",
    state: 'Punjab',
  },
  {
    id: 'temple-meenakshi',
    name: 'Meenakshi Amman Temple',
    category: 'Temple',
    description: 'Located in Madurai, this historic Hindu temple is renowned for its towering gopurams (gateways) covered in colorful figures of gods, goddesses, and demons.',
    image: 'https://images.unsplash.com/photo-1692173248120-59547c3d4653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNZWVuYWtzaGklMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1NTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'The architecture is mind-boggling. I could spend hours just looking at the gopurams.',
        'A vibrant and bustling temple complex with a powerful spiritual atmosphere.',
    ],
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
    reviews: [
        'The reclining idol of Vishnu is magnificent. The temple has a very powerful aura.',
        'The mystery of the unopened vault adds to the allure of this ancient temple.',
    ],
    reason: 'Discover a temple shrouded in mystery and history, known for its immense hidden treasures and stunning architecture.',
    state: 'Kerala',
  },
  {
    id: 'temple-sun-konark',
    name: 'Konark Sun Temple',
    category: 'Temple',
    description: 'A 13th-century CE Sun temple at Konark in Odisha. The temple is attributed to king Narasimhadeva I of the Eastern Ganga Dynasty about 1250 CE. It is designed as a colossal chariot for the sun god, Surya.',
    image: 'https://images.unsplash.com/photo-1695692928722-8120423aabe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxrb25hcmslMjBzdW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzUyNjc1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'An architectural marvel! The intricate stone carvings are incredible.',
        'Even in ruins, the grandeur of this temple is awe-inspiring.',
    ],
    reason: 'Marvel at the architectural genius of a temple shaped like a giant chariot for the Sun God.',
    state: 'Odisha',
  },
  {
    id: 'temple-tirupati-balaji',
    name: 'Tirupati Balaji Temple',
    category: 'Temple',
    description: "The world's most visited temple, receiving 50,000 to 100,000 devotees daily and up to 40 million visitors annually. Dedicated to Lord Venkateswara, it's also one of the richest temples in the world.",
    image: 'https://images.unsplash.com/photo-1733805569204-41768c7d8c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8dGlydXBhdGl8ZW58MHx8fHwxNzUzOTc0MjIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    "data-ai-hint": 'tirupati balaji',
    reviews: [
        'The divine energy here is palpable. A truly moving pilgrimage.',
        'The crowd management is impressive for the number of visitors.',
    ],
    reason: "Visit one of the most revered and wealthiest temples in the world, a major pilgrimage site.",
    state: 'Andhra Pradesh',
  },
];

const FeaturedTempleCard = ({ item, featuredText, onDetailClick }: { item: CulturalItem, featuredText: string, onDetailClick: () => void }) => {
    const siteSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${item.name} official site`)}`;
    return (
        <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
            <p className="font-semibold text-sm uppercase tracking-wider mb-2">{featuredText}</p>
            <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
            <p className="text-sm opacity-90 mb-6">{item.description}</p>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onDetailClick} className="bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground border-accent-foreground/20">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Details
                </Button>
                <Button asChild variant="outline" className="bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground border-accent-foreground/20">
                    <a href={siteSearchUrl} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Visit Official Site
                    </a>
                </Button>
            </div>
        </div>
    );
};

const TempleSection = ({ item, featuredText, reverse = false }: { item: CulturalItem, featuredText: string, reverse?: boolean }) => {
    const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
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
        <>
            <div className={cn(
                "relative flex items-center justify-center py-8 md:py-12 gap-4",
                reverse ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
            )}>
                <div className={cn(
                  "relative w-full max-w-md md:w-1/2 z-10",
                  reverse ? "md:-mr-8 lg:-mr-16" : "md:-ml-8 lg:-ml-16"
                )}>
                <FeaturedTempleCard item={item} featuredText={featuredText} onDetailClick={() => setIsDetailOpen(true)} />
                </div>
                <div className="relative w-full max-w-sm md:w-5/12 lg:w-4/12 h-48 md:h-56 lg:h-64 -mt-8 md:mt-0 group">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg shadow-2xl"
                        data-ai-hint="indian temple"
                    />
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
            {isDetailOpen && (
                <ItemDetailDialog
                    item={item}
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                />
            )}
        </>
    );
};


export default function TemplesPage() {
  const [searchResults, setSearchResults] = useState<CulturalItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleSearchAttempt } = useSearch();

  const handleSearch = async (params: { query: string; place?: string }) => {
    if (!handleSearchAttempt()) return;

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
      const templeResults = results.filter(item => item.category === 'Temple');
      setSearchResults(templeResults);
       if (templeResults.length === 0) {
        toast({ title: "No results found", description: "We couldn't find anything matching your search. Please try entering a correct name for a food, temple, or festival." });
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
        <div className="text-center py-16 flex flex-col items-center justify-center gap-2 animate-pop-in">
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for sacred sites...</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please wait, AI magic can sometimes take up to a minute.</p>
        </div>
      ) : searchResults !== null ? (
            <div className="space-y-12">
                {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                        <TempleSection key={item.id} item={item} featuredText={item.state || "Featured"} reverse={index % 2 === 1} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <Landmark className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Temples Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn't find anything matching your search. Please try entering a correct name for a food, temple, or festival.
                        </p>
                    </div>
                )}
            </div>
      ) : (
         <div className="space-y-12">
            <TempleSection item={allTempleItems[0]} featuredText="Most Visited" reverse={false} />
            <TempleSection item={allTempleItems[1]} featuredText="Architectural Marvel" reverse={true} />
            <TempleSection item={allTempleItems[2]} featuredText="Ancient Wonder" reverse={false} />
            <TempleSection item={allTempleItems[3]} featuredText="Sun Chariot" reverse={true} />
            <TempleSection item={allTempleItems[4]} featuredText="Richest Temple" reverse={false} />
         </div>
      )}
    </div>
  );
}


