

'use client';

import { useEffect, useState } from 'react';
import { summarizeCulturalItem, SummarizeCulturalItemOutput } from '@/ai/flows/summarize-cultural-item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { CulturalItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ItemDetailDialogProps {
  item: CulturalItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getSentimentColor = (score: number) => {
  if (score > 75) return 'text-green-500';
  if (score > 50) return 'text-yellow-500';
  return 'text-red-500';
};

export function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const [analysis, setAnalysis] = useState<SummarizeCulturalItemOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && !analysis) {
      const getAnalysis = async () => {
        setLoading(true);
        try {
          const result = await summarizeCulturalItem({
            name: item.name,
            description: item.description,
            reviews: item.reviews,
          });
          setAnalysis(result);
        } catch (error) {
          console.error(error);
           toast({
            variant: "destructive",
            title: "Error fetching analysis",
            description: "Could not generate an analysis for this item.",
          })
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      getAnalysis();
    }
  }, [open, item, analysis, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-headline text-2xl">{item.name}</DialogTitle>
              <DialogDescription>
                An AI-curated analysis based on descriptions and reviews.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
            {loading ? (
                <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-full" />
                </div>
                </div>
            ) : analysis ? (
                <>
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI Summary</h3>
                    <p className="text-base leading-relaxed">{analysis.summary}</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sentiment Analysis</h3>
                    <div className='flex items-center gap-4'>
                    <div className={`text-3xl font-bold font-headline ${getSentimentColor(analysis.sentimentScore)}`}>
                        {analysis.sentimentScore}
                    </div>
                    <div className="w-full">
                        <Progress value={analysis.sentimentScore} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Negative</span>
                        <span>Positive</span>
                        </div>
                    </div>
                    </div>
                </div>

                {analysis.positiveThemes.length > 0 && (
                    <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        What People Like
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.positiveThemes.map(theme => (
                        <Badge key={theme} variant="outline" className="bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700">{theme}</Badge>
                        ))}
                    </div>
                    </div>
                )}

                {analysis.negativeThemes.length > 0 && (
                    <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        What People Criticize
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.negativeThemes.map(theme => (
                        <Badge key={theme} variant="outline" className="bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700">{theme}</Badge>
                        ))}
                    </div>
                    </div>
                )}
                </>
            ) : null}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
