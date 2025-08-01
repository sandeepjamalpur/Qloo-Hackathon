
'use client';

import React, { useEffect, useState } from 'react';
import { getRecipe } from '@/app/actions';
import type { GetRecipeOutput } from '@/ai/flows/get-recipe';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecipeDetailDialogProps {
  item: CulturalItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetailDialog({ item, open, onOpenChange }: RecipeDetailDialogProps) {
  const [recipe, setRecipe] = useState<GetRecipeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && !recipe) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          if (!item.state) {
            toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Cannot generate a recipe without the state of origin.",
            });
            onOpenChange(false);
            return;
          }
          const result = await getRecipe({
            dishName: item.name,
            state: item.state,
          });
          setRecipe(result);
        } catch (error) {
          console.error(error);
           toast({
            variant: "destructive",
            title: "Error Fetching Recipe",
            description: "Could not generate a recipe for this item.",
          })
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [open, item, recipe, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{item.name} Recipe</DialogTitle>
          <DialogDescription>
            An authentic recipe from {item.state || 'India'}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="space-y-6">
                {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
                ) : recipe ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{recipe}</p>
                ) : null}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
