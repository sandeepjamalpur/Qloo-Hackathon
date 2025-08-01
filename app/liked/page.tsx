
'use client';

import { useLikedItems } from '@/contexts/LikedItemsContext';
import { RecommendationCard } from '@/components/RecommendationCard';
import { Heart } from 'lucide-react';

export default function LikedPage() {
  const { likedItems } = useLikedItems();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-8">
      <div className="flex items-center gap-4">
        <Heart className="w-8 h-8 text-destructive" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Liked Items</h1>
          <p className="text-muted-foreground">A collection of your favorite cultural discoveries.</p>
        </div>
      </div>

      {likedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedItems.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Liked Items Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start exploring and like items to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
