
'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChefHat, Loader2, Heart, MapPin, ImageOff, Search, Mic, BookOpen, Soup, Flame, Zap, Wheat, Droplets, Package, Youtube } from 'lucide-react';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { unifiedSearch } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearch } from '@/contexts/SearchContext';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import { RecipeDetailDialog } from '@/components/RecipeDetailDialog';


const allIndianStates = [
    { value: 'all', label: 'India regions' },
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

interface FoodSearchProps {
  onSearch: (params: { query: string; place?: string, diet?: string }) => void;
  loading: boolean;
  initialQuery?: string;
}

function FoodSearch({ onSearch, loading, initialQuery }: FoodSearchProps) {
  const [query, setQuery] = useState(initialQuery || '');
  const [place, setPlace] = useState('all');
  const [diet, setDiet] = useState('all');
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { handleSearchAttempt } = useSearch();

  useEffect(() => {
    // Ensure this runs only on the client
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
    if (!finalQuery.trim() && place === 'all' && diet === 'all') {
      toast({
        variant: "destructive",
        title: "Search is empty",
        description: "Please enter a query or select a filter to search.",
      });
      return;
    }

    onSearch({ 
        query: finalQuery.trim() || 'famous food', 
        place: place === 'all' ? undefined : place,
        diet: diet === 'all' ? undefined : diet,
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularSearches = [
    "Biryani", "Masala Dosa", "Butter Chicken", "Samosa", 
    "Paneer Tikka", "Chole Bhature", "Tandoori Chicken", "Gulab Jamun"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
       {isListening && (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in"
            onClick={handleVoiceSearch} // Allow closing by clicking the backdrop
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
            placeholder="Search for dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "w-full h-14 pl-12 pr-12 text-lg rounded-full shadow-inner animate-blink-orange-border"
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
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <Select value={place} onValueChange={setPlace} disabled={loading}>
              <SelectTrigger className="h-10 rounded-full">
                  <SelectValue placeholder="India regions" />
              </SelectTrigger>
              <SelectContent>
                  {allIndianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                          {state.label}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
           <Select value={diet} onValueChange={setDiet} disabled={loading}>
              <SelectTrigger className="h-10 rounded-full">
                <SelectValue placeholder="Dietary Options" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Diets</SelectItem>
                  <SelectItem value="veg">Veg</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
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


const allFoodItems: CulturalItem[] = [
  {
    id: 'food-thali',
    name: 'Indian Thali',
    category: 'Food',
    description: "A complete Indian meal with a variety of dishes served on a single platter. It offers a balance of flavors, from savory to sweet, and is a great way to sample regional cuisine.",
    image: 'https://images.unsplash.com/photo-1742281257707-0c7f7e5ca9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxJbmRpYW4lMjBUaGFsaXxlbnwwfHx8fDE3NTI2NzQ0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'A delightful culinary journey on a single plate!',
        'So many flavors to experience at once. Highly recommended for a taste of everything.',
    ],
    reason: "Experience a wide range of Indian flavors in a single, satisfying meal.",
    diet: 'veg',
    state: 'Various',
    calories: 600, protein: '20g', carbs: '80g', fat: '25g', quantity: '1 plate'
  },
  {
    id: 'food-masala-dosa',
    name: 'Masala Dosa',
    category: 'Food',
    description: 'A thin, crispy crepe made from fermented rice and lentil batter, filled with a savory spiced potato mixture. It is a staple breakfast dish in South India.',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    reviews: [
        'Perfectly crispy and the potato filling is delicious.',
        'A must-try South Indian classic.',
    ],
    reason: "A perfect example of South Indian vegetarian cuisine, loved for its crispy texture and flavorful filling.",
    diet: 'veg',
    state: 'Karnataka',
    calories: 300, protein: '8g', carbs: '50g', fat: '8g', quantity: '1 piece'
  },
  {
    id: 'food-butter-chicken',
    name: 'Butter Chicken (Murgh Makhani)',
    category: 'Food',
    description: 'Tender chicken cooked in a mildly spiced, creamy tomato sauce. Its rich, velvety texture and balanced flavors have made it a favorite across the globe.',
    image: 'https://images.unsplash.com/photo-1728910107534-e04e261768ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxidXR0ZXIlMjBjaGlja2VufGVufDB8fHx8MTc1MjY3NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [
        'Creamy, rich, and absolutely delicious. The best I have ever had!',
        'A bit too rich for me, but the flavors were excellent.',
    ],
    reason: 'An iconic Punjabi dish that offers a comforting and indulgent experience, perfect for a hearty meal.',
    diet: 'non-veg',
    state: 'Punjab',
    calories: 450, protein: '30g', carbs: '15g', fat: '30g', quantity: '1 bowl'
  },
  {
    id: 'food-tandoori-chicken',
    name: 'Tandoori Chicken',
    category: 'Food',
    description: 'Marinated in yogurt and spices, tandoori chicken is cooked in a clay oven (tandoor) at high temperatures. The dish is known for its smoky flavor and vibrant reddish color.',
    image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg',
    reviews: [
        'The smoky flavor from the tandoor is incredible.',
        'Perfectly cooked and seasoned. A must-have appetizer.',
    ],
    reason: "A famously smoky and succulent chicken dish cooked in a traditional clay tandoor.",
    diet: 'non-veg',
    state: 'Punjab',
    calories: 280, protein: '35g', carbs: '5g', fat: '12g', quantity: '2 pieces'
  },
  {
    id: 'food-dal-makhani',
    name: 'Dal Makhani',
    category: 'Food',
    description: 'This rich lentil dish, originating in Punjab, features black beans or red kidney beans and black lentils cooked slowly with ghee, butter, and seasonings like ginger and garlic in a tomato-based sauce, creating a velvety flavor.',
    image: 'https://images.pexels.com/photos/4551909/pexels-photo-4551909.jpeg',
    reviews: [
        'So creamy and comforting. It is my go-to comfort food.',
        'The slow-cooked flavor really comes through. Pairs perfectly with naan.',
    ],
    reason: "A creamy and rich lentil stew that's the epitome of Punjabi comfort food.",
    diet: 'veg',
    state: 'Punjab',
    calories: 350, protein: '15g', carbs: '35g', fat: '18g', quantity: '1 bowl'
  },
  {
    id: 'food-chole-bhature',
    name: 'Chole Bhature',
    category: 'Food',
    description: "A North Indian favorite, this dish combines spicy chickpea curry (chole) with deep-fried bread (bhature). It's considered the ultimate comfort food and is particularly popular in Delhi.",
    image: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg',
    reviews: [
        'The bhature are so fluffy and the chole is perfectly spiced.',
        'A heavy meal, but so worth it!',
    ],
    reason: 'A classic street food experience from Delhi, offering a perfect combination of spicy and savory flavors.',
    diet: 'veg',
    state: 'Delhi',
    calories: 500, protein: '12g', carbs: '70g', fat: '20g', quantity: '1 plate'
  },
  {
    id: 'food-biryani-hyderabad',
    name: 'Biryani (Hyderabad)',
    category: 'Food',
    description: "Considered one of India's most beloved dishes, featuring aromatic basmati rice layered with meat or vegetables, cooked with saffron and spices. Hyderabadi biryani is particularly famous.",
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg',
    reviews: [
        'The aroma itself is enough to make you hungry. The rice is so fragrant.',
        'Hyderabadi biryani is the king of all biryanis!',
    ],
    reason: "An iconic and aromatic rice dish that's a cornerstone of Indian cuisine, especially from Hyderabad.",
    diet: 'non-veg',
    state: 'Telangana',
    calories: 480, protein: '25g', carbs: '55g', fat: '18g', quantity: '1 plate'
  },
  {
    id: 'food-rogan-josh',
    name: 'Rogan Josh',
    category: 'Food',
    description: "A signature dish from Kashmir, rogan josh features tender lamb cooked in a rich, aromatic sauce with yogurt and spices. The dish is known for its vibrant red color from Kashmiri chilies.",
    image: 'https://images.pexels.com/photos/16353923/pexels-photo-16353923/pexels-photo-16353923.jpeg',
    reviews: [
        'The lamb is so tender it melts in your mouth.',
        'A rich and flavorful curry that is perfect for a special occasion.',
    ],
    reason: 'Explore the rich, aromatic flavors of Kashmiri cuisine with this signature lamb curry.',
    diet: 'non-veg',
    state: 'Jammu and Kashmir',
    calories: 400, protein: '28g', carbs: '10g', fat: '28g', quantity: '1 bowl'
  },
  {
    id: 'food-gulab-jamun',
    name: 'Gulab Jamun',
    category: 'Food',
    description: 'This popular dessert consists of deep-fried milk solid dumplings soaked in rose-flavored sugar syrup.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/2/384944363/DN/MV/KT/144303146/gulab-jamun-desi-ghee.jpg',
    reviews: [
        'The perfect sweet ending to any meal.',
        'Soft, spongy, and soaked in delicious syrup.',
    ],
    reason: "A classic Indian sweet, these soft, syrup-soaked dumplings are a delightful end to any meal.",
    diet: 'veg',
    state: 'Various',
    calories: 150, protein: '2g', carbs: '25g', fat: '5g', quantity: '2 pieces'
  },
  {
    id: 'food-dhokla',
    name: 'Dhokla',
    category: 'Food',
    description: 'A savory, steamed cake made from a fermented batter of gram flour. It is a popular snack from the state of Gujarat, known for its soft, spongy texture and tangy-sweet taste.',
    image: 'https://images.pexels.com/photos/8246342/pexels-photo-8246342.jpeg',
    reviews: [
        'Light, fluffy, and a great healthy snack.',
        'The tempering on top adds a wonderful flavor.',
    ],
    reason: 'A light and healthy snack from Gujarat that is both delicious and easy to digest.',
    diet: 'veg',
    state: 'Gujarat',
    calories: 160, protein: '6g', carbs: '25g', fat: '4g', quantity: '2 pieces'
  },
    { id: 'food-samosa', name: 'Samosa', category: 'Food', description: 'A fried or baked pastry with a savory filling, such as spiced potatoes, onions, peas, or lentils. It is a popular entree, appetizer, or snack in the local cuisines of South Asia.', image: 'https://images.pexels.com/photos/921294/pexels-photo-921294.jpeg', "data-ai-hint": "indian samosa", reviews: [], reason: 'The perfect crispy and savory snack, loved all over India.', diet: 'veg', state: 'Various', calories: 262, protein: '5g', carbs: '32g', fat: '14g', quantity: '2 pieces' },
    { id: 'food-paneer-tikka', name: 'Paneer Tikka', category: 'Food', description: 'An Indian dish made from chunks of paneer marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes.', image: 'https://images.pexels.com/photos/2092916/pexels-photo-2092916.jpeg', "data-ai-hint": "paneer tikka", reviews: [], reason: 'A smoky and flavorful vegetarian appetizer that is a crowd-pleaser.', diet: 'veg', state: 'Punjab', calories: 350, protein: '20g', carbs: '10g', fat: '25g', quantity: '4 pieces' },
    { id: 'food-vada-pav', name: 'Vada Pav', category: 'Food', description: 'A vegetarian fast food dish native to the state of Maharashtra. It consists of a deep-fried potato dumpling placed inside a bread bun (pav) sliced almost in half through the middle.', image: 'https://images.pexels.com/photos/8743851/pexels-photo-8743851.jpeg', "data-ai-hint": "vada pav", reviews: [], reason: 'The quintessential Mumbai street food, a simple yet satisfying meal.', diet: 'veg', state: 'Maharashtra', calories: 310, protein: '7g', carbs: '48g', fat: '10g', quantity: '1 piece' },
];


const FeaturedRecipeCard = ({ item, onDetailClick }: { item: CulturalItem, onDetailClick: () => void }) => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.name} ${item.state || ''} recipe in english`)}`;

    return (
        <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
        <p className="font-semibold text-sm uppercase tracking-wider mb-2">{item.state}</p>
        <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
        <p className="text-sm opacity-90 mb-6">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" onClick={onDetailClick} className="bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground border-accent-foreground/20">
                <BookOpen className="mr-2 h-4 w-4" />
                Details
            </Button>
            <Button asChild variant="outline" className="bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground border-accent-foreground/20">
                <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-2 h-4 w-4" />
                    Watch Recipe
                </a>
            </Button>
        </div>
        </div>
    );
};

const RecipeSection = ({ item, reverse = false }: { item: CulturalItem, reverse?: boolean }) => {
    const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const liked = isLiked(item.id);

    const handleLikeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            removeLikedItem(item.id);
        } else {
            addLikedItem(item);
        }
    };
    
    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

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
                <FeaturedRecipeCard 
                    item={item} 
                    onDetailClick={() => setIsDetailOpen(true)}
                />
                </div>
                <div className="relative w-full max-w-sm md:w-5/12 lg:w-4/12 h-48 md:h-56 lg:h-64 -mt-8 md:mt-0 group">
                    {imageError ? (
                        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                            <ImageOff className="w-10 h-10 text-muted-foreground"/>
                        </div>
                    ) : (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg shadow-2xl"
                            data-ai-hint="indian food"
                            onError={handleImageError}
                        />
                    )}
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

function FoodPageContent() {
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<CulturalItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const initialQuery = searchParams.get('query') || '';
    const { handleSearchAttempt } = useSearch();

    const handleSearch = async (params: { query: string; place?: string, diet?: string }) => {
        if (!handleSearchAttempt()) return;
        if (!params.query.trim() && !params.place && !params.diet) {
            setSearchResults(null);
            return;
        }
        
        setLoading(true);
        setSearchResults(null);
        try {
            const results = await unifiedSearch({ 
                query: params.query || 'famous food',
                place: params.place,
                diet: params.diet,
            });
            const foodResults = results.filter(item => item.category.toLowerCase() === 'food');
            setSearchResults(foodResults);
            if (foodResults.length === 0) {
                toast({ title: "No results found", description: "We couldn't find any food matching your search." });
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
    
    useEffect(() => {
        if (initialQuery) {
            handleSearch({ query: initialQuery, place: undefined, diet: undefined });
        }
    }, [initialQuery]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
      <FoodSearch onSearch={handleSearch} loading={loading} initialQuery={initialQuery}/>

      {loading ? (
        <div className="text-center py-16 flex flex-col items-center justify-center gap-2 animate-pop-in">
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for delicious food...</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please wait, AI magic can sometimes take up to a minute.</p>
        </div>
      ) : searchResults !== null ? (
        <div className="space-y-12">
            {searchResults.length > 0 ? (
                 <div className="space-y-8 md:space-y-12">
                    {searchResults.map((item, index) => (
                        <RecipeSection key={item.id} item={item} reverse={index % 2 === 1} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                    <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Dishes Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We couldn't find anything matching your search. Please try a different query.
                    </p>
                </div>
            )}
        </div>
      ) : (
        <div className="space-y-12">
          <div className="space-y-8 md:space-y-12">
            <RecipeSection item={allFoodItems[0]} reverse={false} />
            <RecipeSection item={allFoodItems[1]} reverse={true} />
            <RecipeSection item={allFoodItems[2]} reverse={false} />
            <RecipeSection item={allFoodItems[6]} reverse={true} />
            <RecipeSection item={allFoodItems[8]} reverse={false} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function FoodPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FoodPageContent />
        </Suspense>
    )
}
