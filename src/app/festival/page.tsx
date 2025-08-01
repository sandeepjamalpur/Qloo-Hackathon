
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PartyPopper, Loader2, Heart, MapPin, CalendarDays, ImageOff } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { FestivalSearch } from '@/components/FestivalSearch';
import { unifiedSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { RecommendationCard } from '@/components/RecommendationCard';


const allFestivalItems: CulturalItem[] = [
  {
    id: 'fes-diwali',
    name: 'Diwali',
    category: 'Festival',
    description: "Diwali, the 'Festival of Lights,' is India's biggest and most important holiday. The festival gets its name from the row (avali) of clay lamps (deepa) that Indians light outside their homes to symbolize the inner light that protects from spiritual darkness.",
    image: 'https://images.unsplash.com/photo-1700601589928-8937ebf649fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8RGl3YWxpfGVufDB8fHx8MTc1MjY3NjE2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: "Experience the ultimate celebration of light over darkness, a cornerstone of Indian cultural festivities.",
    type: 'Religious',
  },
  {
    id: 'fes-holi',
    name: 'Holi',
    category: 'Festival',
    description: "Holi is a popular ancient Hindu festival, also known as the 'Festival of Love,' the 'Festival of Colours,' and the 'Festival of Spring.' The festival celebrates the eternal and divine love of Radha Krishna. It also signifies the triumph of good over evil.",
    image: 'https://images.unsplash.com/photo-1617184003107-0df15fea4903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8aG9saXxlbnwwfHx8fDE3NTI2NzYyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: "Engage in a joyful explosion of color and celebration, representing the vibrant spirit of Indian festivals.",
    type: 'Seasonal',
  },
  {
    id: 'fes-durga-puja',
    name: 'Durga Puja',
    category: 'Festival',
    description: 'Durga Puja is an annual Hindu festival originating in the Indian subcontinent which reveres and pays homage to the Hindu goddess Durga. It is particularly popular in West Bengal.',
    image: 'https://images.unsplash.com/photo-1616074385287-67f6fb9e9eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkdXJnYSUyMHB1amF8ZW58MHx8fHwxNzUyNjc2MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: "Witness grand artistic pandals and immerse yourself in a deeply cultural and artistic celebration.",
    type: 'Religious',
  },
  {
    id: 'fes-ganesh',
    name: 'Ganesh Chaturthi',
    category: 'Festival',
    description: 'Ganesh Chaturthi is a Hindu festival celebrating the arrival of Ganesh to earth from Kailash Parvat with his mother goddess Parvati/Gauri. The festival is marked with the installation of Ganesh clay idols privately in homes, or publicly on elaborate pandals.',
    image: 'https://images.unsplash.com/photo-1622044720920-aa1765800f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8R2FuZXNoJTIwQ2hhdHVydGhpfGVufDB8fHx8MTc1MjY3NjM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: "Participate in grand processions and witness the devotion of a festival that unites communities.",
    type: 'Religious',
  },
  {
    id: 'fes-onam',
    name: 'Onam',
    category: 'Festival',
    description: "Kerala's harvest festival celebrates the homecoming of King Mahabali with boat races, traditional feasts, and cultural performances. The festival showcases Kerala's rich cultural heritage.",
    image: 'https://images.unsplash.com/photo-1692249088310-a29e13c631d8?q=80&w=1932',
    reviews: [],
    reason: "Experience the vibrant harvest festival of Kerala with its unique cultural celebrations.",
    type: 'Cultural',
  },
];

const FeaturedFestivalCard = ({ item, featuredText }: { item: CulturalItem, featuredText: string }) => (
  <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
    <p className="font-semibold text-sm uppercase tracking-wider mb-2">{featuredText}</p>
    <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
    <p className="text-sm opacity-90">{item.description}</p>
  </div>
);

const FestivalSection = ({ item, featuredText, reverse = false }: { item: CulturalItem, featuredText: string, reverse?: boolean }) => {
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
            <FeaturedFestivalCard item={item} featuredText={featuredText} />
            </div>
            <div className="relative w-full md:w-3/12 h-48 md:h-56 -mt-16 md:mt-0 group">
                {item.image ? <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="indian festival"
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

export default function FestivalPage() {
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
        query: params.query || 'famous festivals', 
        place: params.place 
      });
      setSearchResults(results);
       if (results.length === 0) {
        toast({ title: "No results found", description: "Try a different search query." });
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
      <FestivalSearch onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="text-center py-16 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-muted-foreground">Searching for vibrant celebrations...</p>
        </div>
      ) : searchResults !== null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                        <RecommendationCard key={item.id} item={item} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <PartyPopper className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Festivals Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn't find any festivals matching your search.
                        </p>
                    </div>
                )}
            </div>
      ) : (
        <div className="space-y-12">
            <FestivalSection item={allFestivalItems[0]} featuredText="Featured Festival" reverse={false} />
            <FestivalSection item={allFestivalItems[1]} featuredText="Festival of Colors" reverse={true} />
            <FestivalSection item={allFestivalItems[2]} featuredText="Cultural Extravaganza" reverse={false} />
            <FestivalSection item={allFestivalItems[3]} featuredText="Community Celebration" reverse={true} />
        </div>
      )}
    </div>
  );
}
