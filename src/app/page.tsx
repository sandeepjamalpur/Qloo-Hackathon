
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { generateInitialRecommendations } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecommendationCard } from '@/components/RecommendationCard';
import type { CulturalItem } from '@/types';
import { Loader2, Mic, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useSearch } from '@/contexts/SearchContext';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CulturalItem[]>([]);
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
          setPrompt(speechResult);
          getRecommendations(speechResult); // Automatically search after voice input
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
        variant: 'destructive',
        title: 'Voice Search Not Supported',
        description: 'Your browser does not support voice recognition.',
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

  const mapApiResponseToCulturalItems = (items: any[]): CulturalItem[] => {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description || `An intriguing cultural item titled "${item.name}". Explore its details to learn more.`,
      image: item.image,
      reviews: [
        'A truly captivating experience, highly recommended!',
        'An interesting piece, though it might not be for everyone.',
        'I found it thought-provoking and beautifully executed.',
      ],
      reason: item.reason || "This recommendation is based on your prompt and our analysis of similar cultural items."
    }));
  };

  const getRecommendations = async (searchPrompt?: string) => {
    if (!handleSearchAttempt()) return;
    const finalPrompt = searchPrompt || prompt;
    if (!finalPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Prompt is empty",
        description: "Please tell us what you're looking for.",
      })
      return;
    }
    setLoading(true);
    setRecommendations([]);
    try {
      const result = await generateInitialRecommendations({ prompt: finalPrompt });
      if (result && result.recommendations && result.recommendations.length > 0) {
        setRecommendations(mapApiResponseToCulturalItems(result.recommendations));
      } else {
        toast({
          variant: 'destructive',
          title: 'No Recommendations Found',
          description: 'The AI could not find any recommendations for your prompt, or the service may be temporarily unavailable. Please try a different prompt.',
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
          variant: "destructive",
          title: "Error Generating Recommendations",
          description: "Something went wrong while fetching recommendations. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      getRecommendations();
    }
  };

  const groupedRecommendations = useMemo(() => {
    return recommendations.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, CulturalItem[]>);
  }, [recommendations]);

  return (
    <>
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
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-background flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/14591803/pexels-photo-14591803.jpeg"
          alt="Indian classical dancer"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center text-white p-4">
          <div className="space-y-2 drop-shadow-md">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl xl:text-7xl/none">
              Discover India's Soul
            </h1>
            <p className="max-w-[600px] text-lg md:text-xl mx-auto">
              Your personal guide to the rich tapestry of Indian culture.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        <section className="-mt-16 relative z-20">
          <div className="max-w-3xl mx-auto p-6 md:p-8 bg-card text-card-foreground rounded-lg shadow-2xl animate-slide-up-fade">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-headline font-bold">Find Your Next Cultural Experience</h2>
              <p className="text-muted-foreground">Search for anything from food and festivals to temples and more.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for Places...."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleRecommendationKeyDown}
                  className="w-full h-14 pl-12 pr-20 text-lg rounded-full shadow-inner animate-blink-orange-border"
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <button onClick={handleVoiceSearch} disabled={loading} className="cursor-pointer">
                      <Mic className={cn("h-5 w-5 text-muted-foreground hover:text-primary", isListening && 'text-primary animate-pulse')} />
                   </button>
                   <div className="h-6 w-px bg-border" />
                   <Button onClick={() => getRecommendations()} disabled={loading} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-4">
                      {loading ? <Loader2 className="animate-spin" /> : 'Ask'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12 md:py-20 space-y-16">
          {loading ? (
            <div className="text-center py-16 flex items-center justify-center gap-2 animate-pop-in">
              <Loader2 className="animate-spin text-primary" />
              <p className="text-muted-foreground">Curating your recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedRecommendations).map(([category, items]) => (
                <section key={category}>
                  <h2 className="text-3xl font-headline font-bold mb-6 text-center">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item, index) => (
                      <RecommendationCard key={item.id} item={item} style={{ animationDelay: `${index * 100}ms` }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {/* Festivals Section */}
              <section className="space-y-8 text-center">
                <Image
                  src="https://images.unsplash.com/photo-1585607344893-43a4bd91169a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmZXN0aXZhbHN8ZW58MHx8fHwxNzUyNjc2NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="A collage of Indian landmarks like the Taj Mahal, superimposed with elements of nature like a peacock feather."
                  width={800}
                  height={300}
                  className="w-full max-w-4xl mx-auto h-auto object-cover rounded-lg shadow-lg"
                  data-ai-hint="festivals collage"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">Religious & Spiritual Festivals</h3>
                    <p className="text-muted-foreground text-sm">Sacred celebrations that honor divine traditions, from Diwali's lights in India to Easter festivities in Christianity, showcasing faith through vibrant ceremonies and community gatherings.</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">Seasonal & Harvest Celebrations</h3>
                    <p className="text-muted-foreground text-sm">Time-honored traditions marking nature's cycles, including China's Mid-Autumn Festival, Mexico's Day of the Dead, and Scandinavian Midsummer celebrations that connect communities to the earth.</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">Music & Arts Festivals</h3>
                    <p className="text-muted-foreground text-sm">Cultural expressions through sound and creativity, from Brazil's Carnival rhythms to Scotland's Edinburgh Festival, where artistic traditions meet contemporary innovation on global stages.</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">National & Cultural Heritage Days</h3>
                    <p className="text-muted-foreground text-sm">Celebrations of identity and history, including Independence Day festivities, cultural heritage months, and traditional ceremonies that preserve and share ancestral wisdom with new generations.</p>
                  </div>
                </div>
              </section>

              {/* Food & Cuisine Section */}
              <section className="text-center bg-muted/50 py-16 rounded-lg">
                <div className="max-w-4xl mx-auto px-6">
                  <h2 className="text-3xl md:text-4xl font-headline font-bold">Food & Cuisine</h2>
                  <p className="text-muted-foreground mt-4 mb-10">Food is the universal language that connects us all. Explore culinary traditions that tell stories of migration, adaptation, and creativity across cultures. From family recipes passed down through generations to innovative fusion cuisines, discover how food shapes identity and brings communities together.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-headline text-lg font-semibold mb-2">Traditional Cooking Methods</h3>
                        <p className="text-muted-foreground text-sm mb-4">Ancient techniques passed down through generations, from wood-fired ovens in Italy to tandoor cooking in India, preserving authentic flavors and cultural connections.</p>
                        <Button variant="link" className="p-0 h-auto">Artisanal Heritage Techniques</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-headline text-lg font-semibold mb-2">Regional Specialties & Street Food</h3>
                        <p className="text-muted-foreground text-sm mb-4">Local delicacies that define communities, from Vietnamese pho to Mexican tacos, celebrating the creativity and resourcefulness of culinary traditions worldwide.</p>
                        <Button variant="link" className="p-0 h-auto">Authentic Local Flavors</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Preserving Heritage Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <p className="font-semibold text-primary">Cultural Stories</p>
                  <h2 className="text-3xl md:text-4xl font-headline font-bold">Preserving heritage while embracing evolution</h2>
                  <p className="text-muted-foreground">Every culture has stories that define its essence - tales of resilience, creativity, and adaptation.</p>
                  <p className="text-muted-foreground">We celebrate the keepers of tradition: the artisans, chefs, musicians, and storytellers who ensure cultural heritage thrives in our modern world. Their stories inspire us to honor the past while embracing cultural evolution.</p>
                </div>
                <div>
                  <Image
                    src="https://images.pexels.com/photos/19448840/pexels-photo-19448840.jpeg"
                    alt="A serene Indian temple by a lake with a peacock in the foreground."
                    width={600}
                    height={600}
                    className="rounded-lg shadow-lg aspect-square object-cover"
                    data-ai-hint="indian heritage"
                  />
                </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
