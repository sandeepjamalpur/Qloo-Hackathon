
'use client';

import React, { useEffect, useState } from 'react';
import { getRecipe } from '@/app/actions';
import type { GetRecipeOutput } from '@/types/recipe';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat } from 'lucide-react';

interface RecipeDetailDialogProps {
  item: CulturalItem;
  children: React.ReactNode;
}

export function RecipeDetailDialog({ item, children }: RecipeDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState<GetRecipeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && !recipe && !loading) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          const result = await getRecipe({
            dishName: item.name,
            state: item.state, // Pass state if available, it's optional
          });

          // Check if the service returned a valid recipe
          if (!result || !result.ingredients || result.ingredients.length === 0) {
              toast({
                  variant: "destructive",
                  title: "Recipe Not Available",
                  description: result?.instructions || `Could not generate a recipe for ${item.name} at this time.`,
              });
              setOpen(false);
          } else {
              setRecipe(result);
          }

        } catch (error: any) {
          console.error(error);
          let friendlyMessage = "An unexpected error occurred while fetching the recipe.";
          if (error.message) {
              friendlyMessage = error.message;
          }
          
           toast({
            variant: "destructive",
            title: "Error Fetching Recipe",
            description: friendlyMessage,
          })
          setOpen(false);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [open, item, recipe, toast, loading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
           <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
                <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-headline text-2xl">{item.name} Recipe</DialogTitle>
              <DialogDescription>
                An AI-generated recipe for {item.name}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6 -mr-2">
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
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h4>Ingredients</h4>
                    <ul className="list-disc list-inside">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <h4>Instructions</h4>
                    <p className="whitespace-pre-wrap">{recipe.instructions}</p>
                  </div>
                ) : (
                  !loading && <p className="text-muted-foreground text-center py-8">Could not load recipe.</p>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
