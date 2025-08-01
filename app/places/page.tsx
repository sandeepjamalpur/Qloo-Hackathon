
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Landmark, Loader2, Heart, BookOpen, Link as LinkIcon, ImageOff, MapPin, Mic, Search } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { unifiedSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { cn } from '@/lib/utils';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import { useSearch } from '@/contexts/SearchContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Define the PlacesSearch component directly inside this file
interface PlacesSearchProps {
  onSearch: (params: { query: string; place?: string }) => void;
  loading: boolean;
}

const allIndianStates = [
    { value: 'all', label: 'All Places' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Puducherry', label: 'Puducherry' },
];

function PlacesSearch({ onSearch, loading }: PlacesSearchProps) {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState('all');
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { handleSearchAttempt } = useSearch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setQuery(speechResult);
          handleSearch(speechResult);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
           if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                toast({
                    variant: 'destructive',
                    title: 'Microphone Access Denied',
                    description: 'Please allow microphone access in your browser settings to use voice search.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Voice Search Error',
                    description: 'Something went wrong with voice recognition. Please try again.',
                });
            }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, [toast]);

  const handleVoiceSearch = () => {
      if (!handleSearchAttempt()) return;
      const recognition = recognitionRef.current;
      if (!recognition) {
        toast({
            variant: "destructive",
            title: "Voice Search Not Supported",
            description: "Your browser does not support voice recognition.",
        });
        return;
      }

      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
  };

  const handleSearch = (searchQuery?: string) => {
    if (!handleSearchAttempt()) return;
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim() && place === 'all') {
      toast({
        variant: "destructive",
        title: "Search is empty",
        description: "Please enter a query or select a filter to search.",
      });
      return;
    }
    onSearch({ 
        query: finalQuery.trim() || 'famous places', 
        place: place === 'all' ? undefined : place,
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularSearches = [
    "Varanasi", "Hampi", "Rishikesh", "Jaipur", 
    "Goa", "Mumbai", "Delhi", "Kerala Backwaters"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
       {isListening && (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in"
            onClick={handleVoiceSearch}
        >
            <div className="bg-background p-8 rounded-full animate-pulse">
                <Mic className="h-16 w-16 text-primary" />
            </div>
        </div>
       )}
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for places..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "w-full h-14 pl-12 pr-12 text-lg rounded-full shadow-inner",
              !isListening && "animate-blink-orange-border",
              isListening && "animate-pulse"
            )}
            disabled={loading}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleVoiceSearch} disabled={loading} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
            <Mic className={cn("h-5 w-5 text-muted-foreground hover:text-primary", isListening && 'text-primary')} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground/70 -mt-4">Ai can make mistakes, so double-check it</p>
        
        <Button onClick={() => handleSearch()} disabled={loading} size="lg" className="px-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? <Loader2 className="animate-spin" /> : 'Search'}
        </Button>
        
        <div className="grid grid-cols-1 gap-4 w-full max-w-lg">
          <Select value={place} onValueChange={setPlace} disabled={loading}>
              <SelectTrigger className="h-10 rounded-full">
                  <SelectValue placeholder="All Places" />
              </SelectTrigger>
              <SelectContent>
                  {allIndianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                          {state.label}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
        </div>

        <div className="text-center w-full">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Popular Searches</h4>
            <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map(term => (
                    <Button 
                        key={term}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                            setQuery(term);
                            handleSearch(term);
                        }}
                        disabled={loading}
                    >
                        {term}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
// End of inlined PlacesSearch component

const allPlaceItems: CulturalItem[] = [
  {
    id: 'place-varanasi',
    name: 'Varanasi, Uttar Pradesh',
    category: 'Place',
    description: 'One of the oldest continuously inhabited cities in the world, Varanasi is a spiritual hub famous for its ghats along the Ganges River, where life and death rituals unfold daily.',
    image: 'https://images.unsplash.com/photo-1715163134002-c9399e6f74e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8VmFyYW5hc2klMkMlMjBVdHRhciUyMFByYWRlc2h8ZW58MHx8fHwxNzUzOTc3NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'An intense and profound experience. The Ganga aarti is unforgettable.',
        'A city that truly gets under your skin. Full of contrasts and raw spirituality.',
    ],
    reason: "Experience the spiritual heart of India, a city of ancient rituals and profound moments.",
    state: 'Uttar Pradesh',
  },
  {
    id: 'place-hampi',
    name: 'Hampi, Karnataka',
    category: 'Place',
    description: 'A UNESCO World Heritage site, Hampi was the capital of the Vijayanagara Empire. Its surreal landscape is dotted with hundreds of ancient temples, ruins, and giant boulders.',
    image: 'https://images.unsplash.com/photo-1651597177295-c3a0c2cda7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxoYW1waSUyQyUyMGthcm5hdGFrYXxlbnwwfHx8fDE3NTM5NzcxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'Like stepping into another world. The boulder-strewn landscape is magical.',
        'Rent a scooter and get lost among the ruins. Every corner has a story.',
    ],
    reason: 'Explore a vast, otherworldly landscape of ancient ruins and giant boulders.',
    state: 'Karnataka',
  },
   {
    id: 'place-taj-mahal',
    name: 'Taj Mahal, Agra',
    category: 'Place',
    description: "An ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.",
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3NTI2NzU5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'Even more beautiful in person than in pictures. Truly a wonder of the world.',
        'Go at sunrise to see it in the best light and with fewer crowds.',
    ],
    reason: "Witness the world's most famous monument to love, an icon of architectural beauty.",
    state: 'Uttar Pradesh',
  },
  {
    id: 'place-rishikesh',
    name: 'Rishikesh, Uttarakhand',
    category: 'Place',
    description: 'Known as the "Yoga Capital of the World," Rishikesh is a serene town in the Himalayan foothills. It\'s a center for yoga and meditation, as well as adventure sports like white-water rafting.',
    image: 'https://images.unsplash.com/photo-1679236303854-a47bc30fcfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8UmlzaGlrZXNoJTJDJTIwVXR0YXJha2hhbmR8ZW58MHx8fHwxNzUzOTc3NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'The atmosphere is so peaceful. Perfect for a spiritual retreat.',
        'The Ganga is pristine here, and the surrounding mountains are beautiful.',
    ],
    reason: 'Find your center in the Yoga Capital of the World, nestled in the Himalayas.',
    state: 'Uttarakhand',
  },
];

const FeaturedPlaceCard = ({ item, featuredText, onDetailClick }: { item: CulturalItem, featuredText: string, onDetailClick: () => void }) => {
    const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`;
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
                    <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-4 w-4" />
                        View in Maps
                    </a>
                </Button>
            </div>
        </div>
    );
};

const PlaceSection = ({ item, featuredText, reverse = false }: { item: CulturalItem, featuredText: string, reverse?: boolean }) => {
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
                <FeaturedPlaceCard item={item} featuredText={featuredText} onDetailClick={() => setIsDetailOpen(true)} />
                </div>
                <div className="relative w-full max-w-sm md:w-5/12 lg:w-4/12 h-48 md:h-56 lg:h-64 -mt-8 md:mt-0 group">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg shadow-2xl"
                        data-ai-hint="indian place"
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


export default function PlacesPage() {
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
        query: params.query || "famous places",
        place: params.place 
      });
      const placeResults = results.filter(item => item.category === 'Place');
      setSearchResults(placeResults);
       if (placeResults.length === 0) {
        toast({ title: "No results found", description: "We couldn't find anything matching your search. Please try another query." });
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
      
      <PlacesSearch onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="text-center py-16 flex flex-col items-center justify-center gap-2 animate-pop-in">
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for amazing places...</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please wait, AI magic can sometimes take up to a minute.</p>
        </div>
      ) : searchResults !== null ? (
            <div className="space-y-12">
                {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                        <PlaceSection key={item.id} item={item} featuredText={item.state || "Featured"} reverse={index % 2 === 1} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Places Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn't find any places matching your search. Please try again.
                        </p>
                    </div>
                )}
            </div>
      ) : (
         <div className="space-y-12">
            <PlaceSection item={allPlaceItems[0]} featuredText="Spiritual Hub" reverse={false} />
            <PlaceSection item={allPlaceItems[1]} featuredText="Ancient Kingdom" reverse={true} />
            <PlaceSection item={allPlaceItems[2]} featuredText="Wonder of the World" reverse={false} />
            <PlaceSection item={allPlaceItems[3]} featuredText="Yoga Capital" reverse={true} />
         </div>
      )}
    </div>
  );
}
