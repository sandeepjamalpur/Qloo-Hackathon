
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateImage } from '@/app/actions';
import { Skeleton } from './ui/skeleton';
import { ImageOff } from 'lucide-react';

interface DynamicImageProps {
  query: string;
  alt: string;
}

export function DynamicImage({ query, alt }: DynamicImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setLoading(true);
      try {
        const url = await generateImage(query);
        if (isMounted) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error(`Failed to generate image for query "${query}":`, error);
        if (isMounted) {
          setImageUrl(null); // Set to null on error to show fallback
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (loading) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  if (!imageUrl || imageUrl.includes('placehold.co')) {
    return (
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground"/>
        </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className="object-cover rounded-lg shadow-2xl"
      data-ai-hint="indian food"
    />
  );
}
