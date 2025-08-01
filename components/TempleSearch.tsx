
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mic, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useSearch } from '@/contexts/SearchContext';

interface TempleSearchProps {
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

export function TempleSearch({ onSearch, loading }: TempleSearchProps) {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState('all');
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
    if (!finalQuery.trim() && place === 'all') {
      toast({
        variant: "destructive",
        title: "Search is empty",
        description: "Please enter a query or select a filter to search.",
      });
      return;
    }
    onSearch({ 
        query: finalQuery.trim() || 'famous temples', 
        place: place === 'all' ? undefined : place,
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularSearches = [
    "Golden Temple", "Meenakshi Temple", "Konark Sun Temple", "Tirupati Balaji", 
    "Vaishno Devi", "Akshardham", "Jagannath Puri", "Lotus Temple"
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
            placeholder="Search for temples..."
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
