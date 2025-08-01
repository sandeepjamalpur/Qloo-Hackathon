
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChefHat, Loader2, Heart, MapPin, ImageOff, Search, Mic } from 'lucide-react';
import type { CulturalItem } from 'fire/src/types';
import { useToast } from "fire/src/hooks/use-toast";
import { unifiedSearch } from 'fire/src/app/actions';
import { cn } from 'fire/src/lib/utils';
import { Button } from 'fire/src/components/ui/button';
import { useLikedItems } from 'fire/src/contexts/LikedItemsContext';
import { RecommendationCard } from 'fire/src/components/RecommendationCard';
import { Input } from 'fire/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'fire/src/components/ui/select';

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
}

function FoodSearch({ onSearch, loading }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState('all');
  const [diet, setDiet] = useState('all');
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
        <p className="text-[11px] text-muted-foreground/70 -mt-4">Type "Food" to view food by state.</p>
        
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
    reviews: [],
    reason: "Experience a wide range of Indian flavors in a single, satisfying meal.",
    diet: 'veg',
    state: 'Various',
  },
  {
    id: 'food-masala-dosa',
    name: 'Masala Dosa',
    category: 'Food',
    description: 'A thin, crispy crepe made from fermented rice and lentil batter, filled with a savory spiced potato mixture. It is a staple breakfast dish in South India.',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    reviews: [],
    reason: "A perfect example of South Indian vegetarian cuisine, loved for its crispy texture and flavorful filling.",
    diet: 'veg',
    state: 'Karnataka',
  },
  {
    id: 'food-butter-chicken',
    name: 'Butter Chicken (Murgh Makhani)',
    category: 'Food',
    description: 'Tender chicken cooked in a mildly spiced, creamy tomato sauce. Its rich, velvety texture and balanced flavors have made it a favorite across the globe.',
    image: 'https://images.unsplash.com/photo-1728910107534-e04e261768ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxidXR0ZXIlMjBjaGlja2VufGVufDB8fHx8MTc1MjY3NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    reviews: [],
    reason: 'An iconic Punjabi dish that offers a comforting and indulgent experience, perfect for a hearty meal.',
    diet: 'non-veg',
    state: 'Punjab',
  },
  {
    id: 'food-tandoori-chicken',
    name: 'Tandoori Chicken',
    category: 'Food',
    description: 'Marinated in yogurt and spices, tandoori chicken is cooked in a clay oven (tandoor) at high temperatures. The dish is known for its smoky flavor and vibrant reddish color.',
    image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg',
    reviews: [],
    reason: "A famously smoky and succulent chicken dish cooked in a traditional clay tandoor.",
    diet: 'non-veg',
    state: 'Punjab',
  },
  {
    id: 'food-dal-makhani',
    name: 'Dal Makhani',
    category: 'Food',
    description: 'This rich lentil dish, originating in Punjab, features black beans or red kidney beans and black lentils cooked slowly with ghee, butter, and seasonings like ginger and garlic in a tomato-based sauce, creating a velvety flavor.',
    image: 'https://images.pexels.com/photos/4551909/pexels-photo-4551909.jpeg',
    reviews: [],
    reason: "A creamy and rich lentil stew that's the epitome of Punjabi comfort food.",
    diet: 'veg',
    state: 'Punjab',
  },
  {
    id: 'food-chole-bhature',
    name: 'Chole Bhature',
    category: 'Food',
    description: "A North Indian favorite, this dish combines spicy chickpea curry (chole) with deep-fried bread (bhature). It's considered the ultimate comfort food and is particularly popular in Delhi.",
    image: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg',
    reviews: [],
    reason: 'A classic street food experience from Delhi, offering a perfect combination of spicy and savory flavors.',
    diet: 'veg',
    state: 'Delhi',
  },
  {
    id: 'food-biryani-hyderabad',
    name: 'Biryani (Hyderabad)',
    category: 'Food',
    description: "Considered one of India's most beloved dishes, featuring aromatic basmati rice layered with meat or vegetables, cooked with saffron and spices. Hyderabadi biryani is particularly famous.",
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg',
    reviews: [],
    reason: "An iconic and aromatic rice dish that's a cornerstone of Indian cuisine, especially from Hyderabad.",
    diet: 'non-veg',
    state: 'Telangana',
  },
  {
    id: 'food-rogan-josh',
    name: 'Rogan Josh',
    category: 'Food',
    description: "A signature dish from Kashmir, rogan josh features tender lamb cooked in a rich, aromatic sauce with yogurt and spices. The dish is known for its vibrant red color from Kashmiri chilies.",
    image: 'https://images.pexels.com/photos/16353923/pexels-photo-16353923/pexels-photo-16353923.jpeg',
    reviews: [],
    reason: 'Explore the rich, aromatic flavors of Kashmiri cuisine with this signature lamb curry.',
    diet: 'non-veg',
    state: 'Jammu and Kashmir'
  },
  {
    id: 'food-gulab-jamun',
    name: 'Gulab Jamun',
    category: 'Food',
    description: 'This popular dessert consists of deep-fried milk solid dumplings soaked in rose-flavored sugar syrup.',
    image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
    reviews: [],
    reason: "A classic Indian sweet, these soft, syrup-soaked dumplings are a delightful end to any meal.",
    diet: 'veg',
    state: 'Various',
  },
  {
    id: 'food-dhokla',
    name: 'Dhokla',
    category: 'Food',
    description: 'A savory, steamed cake made from a fermented batter of gram flour. It is a popular snack from the state of Gujarat, known for its soft, spongy texture and tangy-sweet taste.',
    image: 'https://images.pexels.com/photos/8246342/pexels-photo-8246342.jpeg',
    reviews: [],
    reason: 'A light and healthy snack from Gujarat that is both delicious and easy to digest.',
    diet: 'veg',
    state: 'Gujarat'
  },
    { id: 'food-samosa', name: 'Samosa', category: 'Food', description: 'A fried or baked pastry with a savory filling, such as spiced potatoes, onions, peas, or lentils. It is a popular entree, appetizer, or snack in the local cuisines of South Asia.', image: 'https://images.pexels.com/photos/921294/pexels-photo-921294.jpeg', "data-ai-hint": "indian samosa", reviews: [], reason: 'The perfect crispy and savory snack, loved all over India.', diet: 'veg', state: 'Various' },
    { id: 'food-paneer-tikka', name: 'Paneer Tikka', category: 'Food', description: 'An Indian dish made from chunks of paneer marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes.', image: 'https://images.pexels.com/photos/2092916/pexels-photo-2092916.jpeg', "data-ai-hint": "paneer tikka", reviews: [], reason: 'A smoky and flavorful vegetarian appetizer that is a crowd-pleaser.', diet: 'veg', state: 'Punjab' },
    { id: 'food-vada-pav', name: 'Vada Pav', category: 'Food', description: 'A vegetarian fast food dish native to the state of Maharashtra. It consists of a deep-fried potato dumpling placed inside a bread bun (pav) sliced almost in half through the middle.', image: 'https://images.pexels.com/photos/8743851/pexels-photo-8743851.jpeg', "data-ai-hint": "vada pav", reviews: [], reason: 'The quintessential Mumbai street food, a simple yet satisfying meal.', diet: 'veg', state: 'Maharashtra' },
];


const FeaturedRecipeCard = ({ item }: { item: CulturalItem }) => (
  <div className="bg-accent text-accent-foreground p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
    <p className="font-semibold text-sm uppercase tracking-wider mb-2">{item.state}</p>
    <h3 className="font-headline text-3xl md:text-4xl leading-tight mb-4">{item.name}</h3>
    <p className="text-sm opacity-90">{item.description}</p>
  </div>
);

const RecipeSection = ({ item, reverse = false }: { item: CulturalItem, reverse?: boolean }) => {
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
            <FeaturedRecipeCard item={item} />
            </div>
            <div className="relative w-full md:w-3/12 h-48 md:h-56 -mt-16 md:mt-0 group">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg shadow-2xl"
                        data-ai-hint="indian food"
                    />
                ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                        <ImageOff className="w-10 h-10 text-muted-foreground"/>
                    </div>
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
    );
};


export default function FoodPage() {
    const [searchResults, setSearchResults] = useState<CulturalItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (params: { query: string; place?: string, diet?: string }) => {
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
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
      <FoodSearch onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="text-center py-16 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-muted-foreground">Searching for delicious food...</p>
        </div>
      ) : searchResults !== null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.length > 0 ? (
                searchResults.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                ))
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                    <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Dishes Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any dishes matching your search.
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
