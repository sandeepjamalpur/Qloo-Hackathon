
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Soup } from 'lucide-react';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import type { CulturalItem } from '@/types';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import { useState, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

interface RecommendationCardProps extends HTMLAttributes<HTMLDivElement> {
  item: CulturalItem;
}

export function RecommendationCard({ item, className, ...props }: RecommendationCardProps) {
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const liked = isLiked(item.id);

  const handleLikeToggle = () => {
    if (liked) {
      removeLikedItem(item.id);
    } else {
      addLikedItem(item);
    }
  };

  const dataAiHint = item.category ? item.category.split(' ').slice(0, 2).join(' ') : 'cultural item';

  return (
    <>
      <Card 
        className={cn(
          "flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm",
          "hover:scale-105 hover:shadow-primary/20",
          "animate-slide-up-fade",
          className
        )}
        {...props}
      >
        <CardHeader className="p-0 relative">
          <div className="aspect-video relative">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={cn("object-cover transition-opacity duration-500", isImageLoaded ? 'opacity-100' : 'opacity-0')}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={dataAiHint}
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && <Skeleton className="absolute inset-0" />}
          </div>
          {isImageLoaded && <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{item.category}</Badge>}
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          {isImageLoaded ? (
            <>
              <CardTitle className="font-headline text-lg mb-2 line-clamp-2">{item.name}</CardTitle>
              {item.reason && (
                <div className="mt-2 mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                    <p className="text-foreground/90 line-clamp-3"><strong className='font-semibold'>Why you'll like it:</strong> {item.reason}</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{item.description}</p>
            </>
          ) : (
            <div className="space-y-3 mt-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2 mt-auto">
          {isImageLoaded ? (
            <>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(true)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Details
                </Button>
                {item.category === 'Food' && (
                   <RecipeDetailDialog item={item}>
                     <Button variant="outline">
                       <Soup className="mr-2 h-4 w-4" />
                       Recipe
                     </Button>
                   </RecipeDetailDialog>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLikeToggle}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart className={cn('text-muted-foreground transition-colors', liked && 'fill-destructive text-destructive')} />
              </Button>
            </>
          ) : (
             <>
               <Skeleton className="h-10 w-24" />
               <Skeleton className="h-10 w-10 rounded-full" />
             </>
          )}

        </CardFooter>
      </Card>
      {isDetailOpen && (
        <ItemDetailDialog
          item={item}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </>
  );
}
