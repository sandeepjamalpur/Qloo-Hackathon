
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PartyPopper, Loader2, Heart, MapPin, CalendarDays, ImageOff, BookOpen } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { FestivalSearch } from '@/components/FestivalSearch';
import { unifiedSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { cn } from '@/lib/utils';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import { useSearch } from '@/contexts/SearchContext';


const allFestivalItems: CulturalItem[] = [
  {
    id: 'fes-diwali',
    name: 'Diwali',
    category: 'Festival',
    description: "Diwali, the 'Festival of Lights,' is India's biggest and most important holiday. The festival gets its name from the row (avali) of clay lamps (deepa) that Indians light outside their homes to symbolize the inner light that protects from spiritual darkness.",
    image: 'https://images.unsplash.com/photo-1700601589928-8937ebf649fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8RGl3YWxpfGVufDB8fHx8MTc1MjY3NjE2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'A truly magical experience with all the lights and fireworks!',
        'The feeling of community and celebration is unparalleled.',
    ],
    reason: "Experience the ultimate celebration of light over darkness, a cornerstone of Indian cultural festivities.",
    type: 'Religious',
    month: 'October/November',
  },
  {
    id: 'fes-holi',
    name: 'Holi',
    category: 'Festival',
    description: "Holi is a popular ancient Hindu festival, also known as the 'Festival of Love,' the 'Festival of Colours,' and the 'Festival of Spring.' The festival celebrates the eternal and divine love of Radha Krishna. It also signifies the triumph of good over evil.",
    image: 'https://images.unsplash.com/photo-1617184003107-0df15fea4903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8aG9saXxlbnwwfHx8fDE3NTI2NzYyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'So much fun! Throwing colors with friends and strangers is an unforgettable experience.',
        'Can be a bit chaotic, but the energy is infectious.',
    ],
    reason: "Engage in a joyful explosion of color and celebration, representing the vibrant spirit of Indian festivals.",
    type: 'Seasonal',
    month: 'March',
  },
  {
    id: 'fes-durga-puja',
    name: 'Durga Puja',
    category: 'Festival',
    description: 'Durga Puja is an annual Hindu festival originating in the Indian subcontinent which reveres and pays homage to the Hindu goddess Durga. It is particularly popular in West Bengal.',
    image: 'https://images.unsplash.com/photo-1616074385287-67f6fb9e9eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkdXJnYSUyMHB1amF8ZW58MHx8fHwxNzUyNjc2MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'The artistic pandals are breathtaking. It is like an open-air art gallery.',
        'The food stalls during puja are a treat for any foodie.',
    ],
    reason: "Witness grand artistic pandals and immerse yourself in a deeply cultural and artistic celebration.",
    type: 'Religious',
    month: 'September/October',
  },
  {
    id: 'fes-ganesh',
    name: 'Ganesh Chaturthi',
    category: 'Festival',
    description: 'Ganesh Chaturthi is a Hindu festival celebrating the arrival of Ganesh to earth from Kailash Parvat with his mother goddess Parvati/Gauri. The festival is marked with the installation of Ganesh clay idols privately in homes, or publicly on elaborate pandals.',
    image: 'https://images.unsplash.com/photo-1622044720920-aa1765800f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8R2FuZXNoJTIwQ2hhdHVydGhpfGVufDB8fHx8MTc1MjY3NjM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'The grand processions and the final immersion ceremony are a sight to behold.',
        'A very lively and energetic festival that brings everyone together.',
    ],
    reason: "Participate in grand processions and witness the devotion of a festival that unites communities.",
    type: 'Religious',
    month: 'August/September',
  },
];

const FeaturedFestivalCard = ({ item, onDetailClick }: { item: CulturalItem, onDetailClick: () => void }) => (
  <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full relative">
    {item.month && (
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-medium bg-accent-foreground/10 text-accent-foreground px-3 py-1 rounded-full">
        <CalendarDays className="h-4 w-4" />
        <span>{item.month}</span>
      </div>
    )}
    <div className="mb-2">
      <p className="font-semibold text-sm uppercase tracking-wider">{item.type || 'Festival'}</p>
    </div>
    <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
    <p className="text-sm opacity-90 mb-6">{item.description}</p>
    <Button variant="outline" onClick={onDetailClick} className="bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground border-accent-foreground/20">
      <BookOpen className="mr-2 h-4 w-4" />
      Details
    </Button>
  </div>
);

const FestivalSection = ({ item, reverse = false }: { item: CulturalItem, reverse?: boolean }) => {
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
            <FeaturedFestivalCard item={item} onDetailClick={() => setIsDetailOpen(true)} />
            </div>
            <div className="relative w-full max-w-sm md:w-5/12 lg:w-4/12 h-48 md:h-56 lg:h-64 -mt-8 md:mt-0 group">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint="indian festival"
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

export default function FestivalPage() {
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
      // Force the query to include "festival" to ensure correct categorization
      const searchQuery = params.query ? `${params.query} festival` : 'famous festivals';
      
      const results = await unifiedSearch({ 
        query: searchQuery, 
        place: params.place 
      });

      setSearchResults(results);
      if (results.length === 0) {
        toast({ title: "No festivals found", description: "We couldn't find anything matching your search. Please try another query." });
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
        <div className="text-center py-16 flex flex-col items-center justify-center gap-2 animate-pop-in">
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for vibrant celebrations...</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please wait, AI magic can sometimes take up to a minute.</p>
        </div>
      ) : searchResults !== null ? (
            <div className="space-y-12">
                {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                       <FestivalSection key={item.id} item={item} reverse={index % 2 === 1} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <PartyPopper className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Festivals Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn't find anything matching your search. Please try another query.
                        </p>
                    </div>
                )}
            </div>
      ) : (
        <div className="space-y-12">
            <FestivalSection item={allFestivalItems[0]} reverse={false} />
            <FestivalSection item={allFestivalItems[1]} reverse={true} />
            <FestivalSection item={allFestivalItems[2]} reverse={false} />
            <FestivalSection item={allFestivalItems[3]} reverse={true} />
        </div>
      )}
    </div>
  );
}
