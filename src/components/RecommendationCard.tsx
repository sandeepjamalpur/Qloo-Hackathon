
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen } from 'lucide-react';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import type { CulturalItem } from '@/types';
import { ItemDetailDialog } from './ItemDetailDialog';
import { useState, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface RecommendationCardProps extends HTMLAttributes<HTMLDivElement> {
  item: CulturalItem;
}

export function RecommendationCard({ item, className, ...props }: RecommendationCardProps) {
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={dataAiHint}
            />
          </div>
          <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{item.category}</Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="font-headline text-lg mb-2 line-clamp-2">{item.name}</CardTitle>
          {item.reason && (
            <div className="mt-2 mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                <p className="text-foreground/90 line-clamp-3"><strong className='font-semibold'>Why you'll like it:</strong> {item.reason}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{item.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2 mt-auto">
          <Button variant="outline" onClick={() => setIsDetailOpen(true)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Details
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeToggle}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('text-muted-foreground transition-colors', liked && 'fill-destructive text-destructive')} />
          </Button>
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
